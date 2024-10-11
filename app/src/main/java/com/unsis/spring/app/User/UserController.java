package com.unsis.spring.app.User;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.DocumentException;
import com.unsis.spring.app.Auth.AuthResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8080"})
public class UserController {
     
    private final UserService userService;

	@GetMapping(value = "/user")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

	@GetMapping(value = "/user/{id}")
	public ResponseEntity<UserDTO> getUser(@PathVariable Integer id) {
        UserDTO userDTO = userService.getUser(id);
        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping(value = "/user") 
    public ResponseEntity<UserRegistrationResponse> register(@RequestBody UserRequestRol request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(userRequest));
    }

    @PutMapping("/user/{id}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable Integer id) {
        userService.enableUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Integer id) {
        userService.disableUser(id);
        return ResponseEntity.ok().build();
    }

}
