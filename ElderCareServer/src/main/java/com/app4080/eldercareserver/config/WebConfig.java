package com.app4080.eldercareserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    private final String allowedOrigin;

    public WebConfig(@Value("${eldercare.allowed-origin:http://localhost:5173}") String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // The deployed frontend origin was hard coded here, so running
                // the client locally meant editing the server. It is now read
                // from configuration, defaulting to the Vite dev server.
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigin.split(","))
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
