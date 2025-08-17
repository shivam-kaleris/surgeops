package com.surgeops.util;

import com.surgeops.entity.OperationalImpact;

/**
 * Utility class for mapping Open‑Meteo weather codes to human readable conditions,
 * icons and estimating operational impact based on wind speed and precipitation.
 */
public final class WeatherCodeMapper {
    private WeatherCodeMapper() {}

    /**
     * Map a weather code to a short condition string.
     */
    public static String mapCondition(int code) {
        return switch (code) {
            case 0 -> "Clear";
            case 1, 2, 3 -> "Partly cloudy";
            case 45, 48 -> "Foggy";
            case 51, 53, 55 -> "Drizzle";
            case 61, 63, 65 -> "Rain";
            case 66, 67 -> "Freezing rain";
            case 71, 73, 75 -> "Snow";
            case 80, 81, 82 -> "Showers";
            case 95 -> "Thunderstorm";
            case 96, 99 -> "Severe storm";
            default -> "Unknown";
        };
    }

    /**
     * Choose a simple emoji icon for the weather condition.
     */
    public static String mapIcon(int code) {
        return switch (code) {
            case 0 -> "☀️";
            case 1, 2, 3 -> "⛅";
            case 45, 48 -> "🌫️";
            case 51, 53, 55, 61, 63, 65, 80, 81, 82 -> "🌧️";
            case 66, 67 -> "🌧️";
            case 71, 73, 75 -> "❄️";
            case 95, 96, 99 -> "⛈️";
            default -> "❓";
        };
    }

    /**
     * Determine the operational impact given wind speed and weather code.
     * High impact if wind speed >= 12.9 m/s (~25 knots) or severe precipitation codes.
     */
    public static OperationalImpact determineImpact(double windSpeed, int code) {
        // Heavy precipitation codes
        boolean heavyPrecip = code == 65 || code == 75 || code == 82 || code == 96 || code == 99;
        if (windSpeed >= 12.9 || heavyPrecip) {
            return OperationalImpact.High;
        }
        // Moderate precipitation codes
        boolean moderate = code == 63 || code == 73 || code == 81 || code == 95;
        if (windSpeed >= 8.0 || moderate) {
            return OperationalImpact.Medium;
        }
        return OperationalImpact.Low;
    }
}