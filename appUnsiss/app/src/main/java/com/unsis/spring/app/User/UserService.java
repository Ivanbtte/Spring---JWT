package com.unsis.spring.app.User;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository; 
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse updateUser(UserRequest userRequest) {
        User user = userRepository.findById(userRequest.getId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        user.setRole(userRequest.getRole());
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword())); 

        userRepository.save(user);

        return new UserResponse("El usuario se actualizó satisfactoriamente");
    }

    public UserDTO getUser(Integer id) {
        return userRepository.findById(id)
            .map(user -> UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build())
            .orElse(null);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build())
            .collect(Collectors.toList());
    }
}
