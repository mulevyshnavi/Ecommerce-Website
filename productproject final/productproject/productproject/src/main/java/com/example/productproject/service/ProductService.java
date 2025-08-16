package com.example.productproject.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.productproject.entity.Product;
import com.example.productproject.repository.ProductRepository;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    
    public Product updateProduct(int productId, Product productDetails) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            Product updatedProduct = product.get();
            updatedProduct.setName(productDetails.getName());
            updatedProduct.setDescription(productDetails.getDescription());
            updatedProduct.setPrice(productDetails.getPrice());
            updatedProduct.setImageUrl(productDetails.getImageUrl());
            return productRepository.save(updatedProduct);
        }
        return null;
    }

   
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

   
    public Optional<Product> getProductById(int id) {
        return productRepository.findById(id);
    }

  
    public boolean deleteProduct(int id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.delete(product.get());
            return true;
        }
        return false; 
    }
}
