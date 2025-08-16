package com.example.productproject.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public String extractRole(String token) {
        token = token.replace("Bearer ", "");
        Claims claims = extractAllClaims(token);
        String role = claims.get("role", String.class);
        return role != null ? role.replace("ROLE_", "") : null;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(Base64.getDecoder().decode(secret))
                .parseClaimsJws(token)
                .getBody();
    }
}
