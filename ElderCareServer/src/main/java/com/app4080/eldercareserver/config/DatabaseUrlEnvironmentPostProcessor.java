package com.app4080.eldercareserver.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

/**
 * Converts a platform supplied database URI into the form JDBC accepts.
 *
 * Render, Heroku and several other hosts expose a database as a single
 * variable shaped like postgres://user:password@host:port/database. The
 * PostgreSQL JDBC driver does not accept that: it wants a jdbc:postgresql://
 * URL with the credentials supplied separately. Without this the application
 * starts, fails to open a connection, and the platform reports a failed deploy
 * with a driver error that does not mention the real cause.
 *
 * Runs before the DataSource is built. A value that already begins with jdbc:
 * is left alone, so local configuration is unaffected.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "renderDatabaseUrl";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment,
                                       SpringApplication application) {

        String raw = environment.getProperty("DATABASE_URL");

        if (raw == null || raw.isBlank() || raw.startsWith("jdbc:")) {
            return;
        }

        Map<String, Object> resolved = convert(raw);

        if (!resolved.isEmpty()) {
            environment.getPropertySources()
                    .addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, resolved));
        }
    }

    static Map<String, Object> convert(String raw) {
        Map<String, Object> properties = new HashMap<>();

        URI uri;
        try {
            uri = new URI(raw);
        } catch (URISyntaxException e) {
            return properties;
        }

        String scheme = uri.getScheme();
        if (scheme == null || !scheme.startsWith("postgres")) {
            return properties;
        }

        int port = uri.getPort() == -1 ? 5432 : uri.getPort();
        String database = uri.getPath() == null ? "" : uri.getPath();

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(uri.getHost())
                .append(':')
                .append(port)
                .append(database);

        // Managed PostgreSQL instances generally require TLS, and the driver
        // does not assume it.
        if (uri.getQuery() == null) {
            jdbcUrl.append("?sslmode=require");
        } else {
            jdbcUrl.append('?').append(uri.getQuery());
        }

        properties.put("spring.datasource.url", jdbcUrl.toString());

        String userInfo = uri.getUserInfo();
        if (userInfo != null && !userInfo.isBlank()) {
            int separator = userInfo.indexOf(':');
            if (separator == -1) {
                properties.put("spring.datasource.username", userInfo);
            } else {
                properties.put("spring.datasource.username", userInfo.substring(0, separator));
                properties.put("spring.datasource.password", userInfo.substring(separator + 1));
            }
        }

        return properties;
    }
}
