package com.unsis.spring.app.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.unsis.spring.app.User.UserDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestigadorDto {
    private Integer id;
    private Integer num_empleado;
    private String nombre_1_investigador;
    private String nombre_2_investigador;
    private String apellido_paterno_1_investigador;
    private String apellido_materno_2_investigador;
    private UserDTO user;  // Referencia a UserDto
    private InstitutoDto instituto;  // Referencia a InstitutoDto
    private AutorDto autor;  // Referencia a AutorDto
}
