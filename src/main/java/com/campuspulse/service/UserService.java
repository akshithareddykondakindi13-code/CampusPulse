
package com.campuspulse.service;

import com.campuspulse.entity.User;
import com.campuspulse.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        if (user.getFullName() == null ||
                user.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }

        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters");
        }

        if (userRepository.existsByEmail(user.getEmail().trim())) {
            throw new IllegalArgumentException(
                    "Email is already registered");
        }

        user.setId(null);
        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Public registration must never grant administrator access.
        user.setRole("STUDENT");

        return userRepository.save(user);
    }

public User login(String email, String password) {

    if (email == null || email.isBlank()
            || password == null || password.isBlank()) {
        throw new IllegalArgumentException(
                "Email and password are required");
    }

    User user = userRepository
            .findByEmail(email.trim().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException(
                    "Invalid email or password"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new IllegalArgumentException(
                "Invalid email or password");
    }

    return user;
}

}
