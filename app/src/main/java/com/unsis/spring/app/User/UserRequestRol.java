package com.unsis.spring.app.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestRol {
    
    String username;
    String password;
    private Role role; // Campo para rol
}



