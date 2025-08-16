package com.example.cartservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.cartservice.dto.Product;
import com.example.cartservice.entity.CartItem;
import com.example.cartservice.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String PRODUCT_SERVICE_URL = "http://productproject/products/";

    
    public CartItem addToCart(String username, String token, CartItem item) {
        System.out.println("Adding item to cart: " + item.getProductId() + " for user: " + username);

       
        CartItem updatedItem = fetchProductDetails(item, token);

       
        System.out.println("Updated item: " + updatedItem.getProductName() + ", " + updatedItem.getPrice());

        
        Optional<CartItem> existing = cartRepository.findByUsernameAndProductId(username, item.getProductId());
        if (existing.isPresent()) {
            CartItem existingItem = existing.get();
            existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
            return cartRepository.save(existingItem);
        }

       
        updatedItem.setUsername(username);
        return cartRepository.save(updatedItem);
    }

    
    public List<CartItem> getCartItems(String username) {
        return cartRepository.findByUsername(username);
    }

    
    public CartItem updateCartItem(String username, int productId, int quantity) {
        Optional<CartItem> item = cartRepository.findByUsernameAndProductId(username, productId);
        if (item.isPresent()) {
            CartItem cartItem = item.get();
            cartItem.setQuantity(quantity);
            return cartRepository.save(cartItem);
        }
        return null;
    }

    
    public boolean removeItem(String username, int productId) {
        Optional<CartItem> item = cartRepository.findByUsernameAndProductId(username, productId);
        if (item.isPresent()) {
            cartRepository.delete(item.get());
            return true;
        }
        return false;
    }

   
    @Transactional
    public void clearCart(String username) {
        cartRepository.deleteByUsername(username);
    }

    
    private CartItem fetchProductDetails(CartItem item, String token) {
        String productUrl = PRODUCT_SERVICE_URL + item.getProductId();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Product> response = restTemplate.exchange(
                productUrl,
                HttpMethod.GET,
                entity,
                Product.class
        );

        Product product = response.getBody();

        if (product != null) {
            item.setProductName(product.getName());
            item.setPrice(product.getPrice());
        }
        return item;
    }
}
