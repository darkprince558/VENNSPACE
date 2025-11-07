package com.example.venndiagramapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This is the new main entry point for the application.
 * It launches the Spring Boot web server.
 */
@SpringBootApplication // This one annotation enables the web server, component scanning, and auto-configuration
public class VennApiApplication {

    public static void main(String[] args) {
        // This static method starts the embedded Tomcat server and launches your app
        SpringApplication.run(VennApiApplication.class, args);
    }
}