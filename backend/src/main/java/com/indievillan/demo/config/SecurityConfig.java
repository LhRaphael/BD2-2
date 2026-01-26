package com.indievillan.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilita proteção CSRF para facilitar testes via Postman
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Libera TUDO
            );
        return http.build();
    }

    @Bean
    public MongoClient mongoClient(@Value("${spring.data.mongodb.uri}") String connectionString) {
        // Isso força o Spring a usar a URI do seu application.properties
        // ignorando qualquer padrão que esteja apontando para localhost
		return MongoClients.create(connectionString);
	}
}