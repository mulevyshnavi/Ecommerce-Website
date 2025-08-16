package com.example.cartservice.controller;

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

import com.example.cartservice.entity.CartItem;
import com.example.cartservice.service.CartService;
import com.example.cartservice.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    private boolean isUser(String token) {
        String role = jwtUtil.extractRole(token);
        return "USER".equals(role);
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItem item, @RequestHeader("Authorization") String token) {
        if (!isUser(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only USER can add to cart.");
        String username = jwtUtil.extractUsername(token);
        return ResponseEntity.ok(cartService.addToCart(username, token, item));
    }


    @GetMapping
    public ResponseEntity<?> getCartItems(@RequestHeader("Authorization") String token) {
        if (!isUser(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only USER can view cart.");
        String username = jwtUtil.extractUsername(token);
        return ResponseEntity.ok(cartService.getCartItems(username));
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateCart(@PathVariable int productId, @RequestBody CartItem item, @RequestHeader("Authorization") String token) {
        if (!isUser(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only USER can update cart.");
        String username = jwtUtil.extractUsername(token);
        CartItem updated = cartService.updateCartItem(username, productId, item.getQuantity());
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<?> deleteItem(@PathVariable int productId, @RequestHeader("Authorization") String token) {
        if (!isUser(token)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only USER can delete cart items.");
        String username = jwtUtil.extractUsername(token);
        boolean deleted = cartService.removeItem(username, productId);
        return deleted ? ResponseEntity.ok("Item removed") : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing");
        }

        try {
            if (!isUser(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only USER can clear cart.");
            }

            String username = jwtUtil.extractUsername(token);
            cartService.clearCart(username);
            return ResponseEntity.ok("Cart cleared");

        } catch (Exception e) {
            e.printStackTrace(); // log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing token: " + e.getMessage());
        }
    }

}


