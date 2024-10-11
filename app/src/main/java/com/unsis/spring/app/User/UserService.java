package com.unsis.spring.app.User;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Auth.AuthResponse;
import com.unsis.spring.app.Jwt.JwtService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public UserResponse updateUser(UserRequest userRequest) {
        User user = userRepository.findById(userRequest.getId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: "+userRequest.getId()));

        user.setRole(userRequest.getRole());
        if (userRequest.getUsername() != null) {
            user.setUsername(userRequest.getUsername());
        } // Solo actualizar la contraseña si está presente en la solicitud
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        userRepository.save(user);

        return new UserResponse("El usuario se actualizó satisfactoriamente");
    }

    public UserDTO getUser(Integer id) {
        return userRepository.findById(id)
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole().name())
                        .enabled(user.isEnabled())
                        .build())
                .orElse(null);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole().name())
                        .enabled(user.isEnabled())
                        .build())
                .collect(Collectors.toList());
    }

    public AuthResponse register(UserRequestRol request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole()) // Usar el rol proporcionado por el usuario
                .enabled(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder().token(jwtService.getToken(user)).build();
    }

    public UserRegistrationResponse registerUser(UserRequestRol request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole()) // Usar el rol proporcionado por el usuario
                .enabled(true)
                .build();

        userRepository.save(user);

        return UserRegistrationResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name()) // Convertir el rol a String
                .build();

    }

    @Transactional
    public void enableUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void disableUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        user.setEnabled(false);
        userRepository.save(user);
    }

}
