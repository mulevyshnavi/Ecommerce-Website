package com.example.orderservice.service;

import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.entity.Order;
import com.example.orderservice.entity.OrderItem;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String CART_SERVICE_URL = "http://cartservice/cart";

    @Transactional
    public Order placeOrder(String username, OrderRequest request, String token) {
       
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

       
        ResponseEntity<OrderItem[]> response = restTemplate.exchange(
                CART_SERVICE_URL,
                HttpMethod.GET,
                entity,
                OrderItem[].class
        );

        OrderItem[] itemsArray = response.getBody();

        if (itemsArray == null || itemsArray.length == 0) {
            throw new RuntimeException("Cart is empty. Cannot place order.");
        }

        
        List<OrderItem> items = Arrays.asList(itemsArray);
        double totalAmount = items.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();

        
        Order order = new Order();
        order.setUsername(username);
        order.setShippingAddress(request.getShippingAddress());
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");

       
        for (OrderItem item : items) {
            item.setOrder(order);
            item.setId(null); 
        }

        order.setItems(items);

       
        Order savedOrder = orderRepository.save(order);

      
        restTemplate.exchange(
                CART_SERVICE_URL + "/clear?username=" + username,
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                Void.class
        );

        return savedOrder;
    }

   
    public List<Order> getUserOrders(String username) {
        return orderRepository.findByUsername(username);
    }

   
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

   
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setStatus(status.toUpperCase()); 
        return orderRepository.save(order);
    }
}
