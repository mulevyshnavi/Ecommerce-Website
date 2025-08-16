package com.example.productproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ProductprojectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductprojectApplication.class, args);
	}

}
