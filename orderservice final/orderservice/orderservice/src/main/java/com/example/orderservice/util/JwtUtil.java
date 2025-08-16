package com.example.orderservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Object roleClaim = extractAllClaims(token).get("role");
        if (roleClaim == null) return ""; 
        String role = roleClaim.toString();
        if (role.startsWith("ROLE_")) {
            role = role.substring(5); 
        }
        return role.toUpperCase(); 
    }

    private Claims extractAllClaims(String token) {
        byte[] decodedKey = Base64.getDecoder().decode(secret);
        return Jwts.parser()
                .setSigningKey(decodedKey)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
    }
}
