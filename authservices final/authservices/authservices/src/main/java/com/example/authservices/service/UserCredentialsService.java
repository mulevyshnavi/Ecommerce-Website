package com.example.authservices.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.authservices.dao.UserCredentialsDao;
import com.example.authservices.entity.User;

@Service
public class UserCredentialsService {

    @Autowired
    JwtService jwtService;
    
    @Autowired
    UserCredentialsDao authDao;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

       
        String rawRole = user.getRole();
        if (rawRole == null || rawRole.isBlank()) {
            user.setRole("ROLE_USER");
        } else {
           
            String roleFormatted = rawRole.toUpperCase().startsWith("ROLE_") 
                ? rawRole.toUpperCase()
                : "ROLE_" + rawRole.toUpperCase();
            user.setRole(roleFormatted);
        }

        return authDao.saveAndFlush(user);
    }


    public String generateToken(String name, String role) {
        return jwtService.generateToken(name, role);  
    }

    public boolean verifyToken(String token) {
        jwtService.validateToken(token);
        return true;
    }

    public User getUserByName(String username) {
        return authDao.findByName(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
