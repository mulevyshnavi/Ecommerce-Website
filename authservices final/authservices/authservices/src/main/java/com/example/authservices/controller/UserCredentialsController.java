package com.example.authservices.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.authservices.dto.AuthResponse;
import com.example.authservices.entity.User;
import com.example.authservices.service.JwtService;
import com.example.authservices.service.UserCredentialsService;


@RestController
@RequestMapping("/api/auth")
public class UserCredentialsController {

    @Autowired
    JwtService jwtService;

    @Autowired
    private UserCredentialsService userCredService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        User registeredUser = userCredService.register(user);

        
        String token = userCredService.generateToken(registeredUser.getName(), registeredUser.getRole());

        return new AuthResponse(token);
    }
    @GetMapping("/validate/token")
    public boolean validateToken(@RequestParam String token) {
        return userCredService.verifyToken(token);
    }

    @PostMapping("/validate/user")
    public String getToken(@RequestBody User user) {
        Authentication authenticate = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getName(), user.getPassword()));

        if (authenticate.isAuthenticated()) {
            User authenticatedUser = userCredService.getUserByName(user.getName());
            String role = authenticatedUser.getRole();  
            return userCredService.generateToken(user.getName(), role);  
        }
        return null;
    }
}
