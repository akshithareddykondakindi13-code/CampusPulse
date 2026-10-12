
package com.campuspulse.controller;

import com.campuspulse.dto.LoginRequest;
import com.campuspulse.entity.User;
import com.campuspulse.security.JwtService;
import com.campuspulse.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody User user) {

        User savedUser = userService.register(user);
        savedUser.setPassword(null);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequest request) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword());

        String token = jwtService.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("token", token);
        response.put("message", "Login successful");

        return ResponseEntity.ok(response);
    }
}
