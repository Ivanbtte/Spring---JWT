package com.unsis.spring.app.Entity.BD1;

import com.unsis.spring.app.User.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @Column(nullable = false)
    private Integer num_empleado;

    @Column(nullable = false)
    private  String nombre_1_investigador;

    @Column(nullable = false)
    private String nombre_2_investigador;

    @Column(nullable = false)
    private String apellido_paterno_1_investigador;
    
    @Column()
    private String apellido_materno_2_investigador;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "id_instituto", nullable = false)
    private Instituto instituto;

    @OneToOne
    @JoinColumn(name = "id_autor", nullable = false)
    private Autor autor;

}
