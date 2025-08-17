package com.surgeops.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.surgeops.dto.WeatherDto;
import com.surgeops.entity.OperationalImpact;
import com.surgeops.entity.WeatherObservation;
import com.surgeops.repo.WeatherObservationRepository;
import com.surgeops.util.WeatherCodeMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * Service for retrieving weather observations either from cache or by calling
 * the Open-Meteo API. Weather data is cached in the database for a configurable
 * number of minutes.
 */
@Service
public class WeatherFetcherService {

    private final WeatherObservationRepository weatherObservationRepository;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    private final String provider;
    private final long recencyMinutes;

    public WeatherFetcherService(WeatherObservationRepository weatherObservationRepository,
                                 WebClient.Builder webClientBuilder,
                                 @Value("${weather.provider}") String provider,
                                 @Value("${weather.recencyMinutes:30}") long recencyMinutes) {
        this.weatherObservationRepository = weatherObservationRepository;
        this.webClientBuilder = webClientBuilder;
        this.objectMapper = new ObjectMapper();
        this.provider = provider;
        this.recencyMinutes = recencyMinutes;
    }

    /**
     * Get the latest weather for the specified location. Uses cached data if available and fresh.
     * Otherwise calls the configured provider.
     *
     * @param location port name to query
     * @return a WeatherDto representing current conditions
     */
    @Transactional
    public WeatherDto getWeather(String location) {
        String loc = location.trim();
        Instant cutoff = Instant.now().minus(recencyMinutes, ChronoUnit.MINUTES);
        List<WeatherObservation> recents = weatherObservationRepository
                .findByLocationAndObservedAtAfterOrderByObservedAtDesc(loc, cutoff);
        if (!recents.isEmpty()) {
            return toDto(recents.get(0));
        }
        WeatherObservation obs = fetchFromProvider(loc);
        weatherObservationRepository.save(obs);
        return toDto(obs);
    }

    private WeatherDto toDto(WeatherObservation obs) {
        return new WeatherDto(
                obs.getLocation(),
                obs.getTemperature(),
                obs.getWindSpeed(),
                obs.getHumidity(),
                obs.getCondition(),
                obs.getIcon(),
                obs.getOperationalImpact() != null ? obs.getOperationalImpact().name() : null,
                WeatherDto.formatInstant(obs.getObservedAt())
        );
    }

    /**
     * Fetch current weather data for the given location by calling the Open-Meteo APIs.
     */
    private WeatherObservation fetchFromProvider(String location) {
        if (!"open-meteo".equalsIgnoreCase(provider)) {
            throw new IllegalStateException("Unsupported weather provider: " + provider);
        }

        try {
            WebClient client = webClientBuilder.build();

            // Step 1: geocode the location to lat/lon
            String locEncoded = URLEncoder.encode(location, StandardCharsets.UTF_8);
            String geocodeUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + locEncoded + "&count=1";

            String geoBody = client.get()
                    .uri(geocodeUrl)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode geoJson = objectMapper.readTree(geoBody);
            JsonNode results = geoJson.path("results");
            if (!results.isArray() || results.isEmpty()) {
                throw new RuntimeException("Location not found: " + location);
            }
            double lat = results.get(0).path("latitude").asDouble();
            double lon = results.get(0).path("longitude").asDouble();

            // Step 2: fetch current weather
            String weatherUrl = String.format(
                    "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code",
                    lat, lon
            );

            String weatherBody = client.get()
                    .uri(weatherUrl)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode weatherJson = objectMapper.readTree(weatherBody);
            JsonNode current = weatherJson.path("current");
            double temperature = current.path("temperature_2m").asDouble();
            double windSpeed = current.path("wind_speed_10m").asDouble();
            double humidity = current.path("relative_humidity_2m").asDouble();
            int code = current.path("weather_code").asInt();

            String condition = WeatherCodeMapper.mapCondition(code);
            String icon = WeatherCodeMapper.mapIcon(code);
            OperationalImpact impact = WeatherCodeMapper.determineImpact(windSpeed, code);

            return WeatherObservation.builder()
                    .id(UUID.randomUUID())
                    .location(location)
                    .temperature(temperature)
                    .windSpeed(windSpeed)
                    .humidity(humidity)
                    .condition(condition)
                    .icon(icon)
                    .operationalImpact(impact)
                    .observedAt(Instant.now())
                    .build();

        } catch (Exception ex) {
            throw new RuntimeException("Failed to fetch weather for " + location, ex);
        }
    }
}