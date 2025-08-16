package com.example.authservices.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.authservices.entity.User;

@Repository
public interface UserCredentialsDao extends JpaRepository<User, Integer> {
    Optional<User> findByName(String name);
}


