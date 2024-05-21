package com.unsis.spring.app.Auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.unsis.spring.app.Jwt.JwtService;
import com.unsis.spring.app.User.Role;
import com.unsis.spring.app.User.User;
import com.unsis.spring.app.User.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;


    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails user=userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token=jwtService.getToken(user);
        return AuthResponse.builder()
            .token(token)
            .build();
    }

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
        .username(request.getUsername())
        .password(passwordEncoder.encode( request.getPassword()))
        .nombres(request.getNombres())
        .apellidoP(request.getApellidoP())
        .apellidoM(request.getApellidoM())
        .role(Role.INVESTIGADOR)
        .build();

        userRepository.save(user);

        return AuthResponse.builder().token(jwtService.getToken(user)).build();

    }

}
