package com.example.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.service.OrderService;
import com.example.orderservice.util.JwtUtil;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    private boolean isUser(String token) {
        return "USER".equals(jwtUtil.extractRole(token));
    }

    private boolean isAdmin(String token) {
        return "ADMIN".equals(jwtUtil.extractRole(token));
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestHeader("Authorization") String token,
                                        @RequestBody OrderRequest request) {
        if (!isUser(token)) return ResponseEntity.status(403).body("Only USER can place orders");
        String username = jwtUtil.extractUsername(token); 
        return ResponseEntity.ok(orderService.placeOrder(username, request, token));
    }



    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String token) {
        if (!isUser(token)) return ResponseEntity.status(403).body("Only USER can view their orders");
        String username = jwtUtil.extractUsername(token);
        return ResponseEntity.ok(orderService.getUserOrders(username));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) return ResponseEntity.status(403).body("Only ADMIN can view all orders");
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/update/{orderId}")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId,
                                          @RequestParam String status,
                                          @RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) return ResponseEntity.status(403).body("Only ADMIN can update order status");
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
