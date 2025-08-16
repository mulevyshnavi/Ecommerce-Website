package com.example.cartservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(Base64.getDecoder().decode(secret))
                    .parseClaimsJws(token.replace("Bearer ", ""))
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        if (claims != null) {
            String role = claims.get("role", String.class);
            return role != null ? role.replace("ROLE_", "") : null;
        }
        return null;
    }
}


