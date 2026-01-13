package com.deep.chat.config;

public class AppConstants {
    public static final String FRONT_END_BASE_URL = getFrontendUrl();

    private static String getFrontendUrl() {
        String envUrl = System.getenv("FRONTEND_URL");
        if (envUrl != null && !envUrl.isEmpty()) {
            return envUrl;
        }
        return "http://localhost:5173";
    }
}
