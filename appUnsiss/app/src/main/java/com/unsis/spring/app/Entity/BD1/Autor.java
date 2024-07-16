package com.unsis.spring.app.Entity.BD1;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "autores")
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_autor;

    @Column(name = "nombre_1_autor", nullable = false)
    private String nombre1Autor;

    @Column(name = "nombre_2_autor")
    private String nombre2Autor;

    @Column(name = "apellido_paterno_autor", nullable = false)
    private String apellidoPaternoAutor;

    @Column(name = "apellido_materno_autor")
    private String apellidoMaternoAutor;

    @Column(name = "autor_unsis", nullable = false)
    private Boolean autorUnsis;

    @ManyToMany(mappedBy = "autores")
    private Set<Articulos> articulos = new HashSet<>();
}
