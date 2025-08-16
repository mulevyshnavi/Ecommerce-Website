package com.example.productproject.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.productproject.entity.Product;
import com.example.productproject.service.ProductService;
import com.example.productproject.util.JwtUtil;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN can add products.");
        }
        return ResponseEntity.ok(productService.addProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @RequestBody Product product, @RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN can update products.");
        }
        Product updated = productService.updateProduct(id, product);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ADMIN can delete products.");
        }
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.ok("Product deleted successfully.") : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token);
        if (!"ADMIN".equals(role) && !"USER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access.");
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token);
        if (!"ADMIN".equals(role) && !"USER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access.");
        }
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
