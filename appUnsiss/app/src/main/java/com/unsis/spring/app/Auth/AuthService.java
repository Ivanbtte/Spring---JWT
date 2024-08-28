package com.unsis.spring.app.Auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Entity.BD1.Investigador;
import com.unsis.spring.app.Jwt.JwtService;
import com.unsis.spring.app.Repository.BD1.InvestigadorDao;
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
    private final InvestigadorDao investigadorDao;

    public AuthResponse login(LoginRequest request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        if (!user.isEnabled()) {
            throw new IllegalStateException("Usuario deshabilitado");
        }

        // Inicializar el valor de instituto en null
        long instituto = 0;
        int id = 0;

        // Verificar el rol del usuario y si es COORDINADOR o INVESTIGADOR, buscar el
        // instituto
        if (user.getRole() == Role.COORDINADOR || user.getRole() == Role.INVESTIGADOR) {
            Investigador investigador = investigadorDao.findByUser(user).orElseThrow();
            instituto = investigador.getInstituto().getId();
            id = investigador.getId(); // Obtener el nombre del instituto
        }

        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .instituto(instituto)
                .id(id) // Añadir el instituto
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROOT)
                .enabled(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .role(user.getRole().name()) // Añadir esta línea
                .build();
    }

}
