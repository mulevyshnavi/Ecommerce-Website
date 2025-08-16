package com.example.cartservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cartservice.entity.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUsername(String username);
    Optional<CartItem> findByUsernameAndProductId(String username, int productId);
    void deleteByUsername(String username);
    void deleteByUsernameAndProductId(String username, int productId);
}
