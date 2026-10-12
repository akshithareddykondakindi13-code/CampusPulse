
package com.campuspulse.config;

import com.campuspulse.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers(
                    "/api/users/login",
                    "/api/users/register"
                ).permitAll()

                // Students and admins must be authenticated to submit.
                .requestMatchers(HttpMethod.POST, "/api/issues").authenticated()

                // Viewing all complaints and individual complaint details is admin-only.
                .requestMatchers(HttpMethod.GET, "/api/issues").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/issues/*")
                    .hasRole("ADMIN")

                // Only admins can edit, change status, or delete.
                .requestMatchers(HttpMethod.PUT, "/api/issues/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/issues/*/status")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/issues/*")
                    .hasRole("ADMIN")

                // Viewing complaints by user ID requires authentication.
                // Ownership must also be enforced in the controller.
                .requestMatchers(HttpMethod.GET, "/api/issues/user/*")
                    .authenticated()

                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:5173",
            		 "http://localhost:5174")
        );
        configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
