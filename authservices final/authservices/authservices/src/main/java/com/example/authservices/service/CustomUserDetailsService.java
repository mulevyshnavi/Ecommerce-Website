package com.example.authservices.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.authservices.dao.UserCredentialsDao;
import com.example.authservices.entity.User;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserCredentialsDao userCredentialsDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userCredentialsDao.findByName(username);
        return user.map(CustomUserDetails::new)
                   .orElseThrow(() -> new UsernameNotFoundException("Username/password not valid!"));
    }
}
