package com.example.productproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.productproject.entity.Product;



public interface ProductRepository extends JpaRepository<Product, Integer> {
}