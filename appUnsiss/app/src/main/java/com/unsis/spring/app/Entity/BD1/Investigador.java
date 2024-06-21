package com.unsis.spring.app.Entity.BD1;

import org.antlr.v4.runtime.misc.NotNull;

import com.unsis.spring.app.User.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;  

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="investigador")
public class Investigador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @JoinColumn(nullable = false)
    Integer num_empleado;

    @JoinColumn(nullable = false)
    String nombre_1_investigador;

    @JoinColumn(nullable = false)
    String nombre_2_investigador;

    @JoinColumn(nullable = false)
    String apellido_paterno_1_investigador;
    
    @JoinColumn()
    String apellido_materno_2_investigador;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private User user;
    
    //Hablar con el jefe de carrera
    @OneToOne
    @JoinColumn(name = "id_instituto", nullable = false)
    private Instituto instituto;

}
