package com.unsis.spring.app.Entity.BD1;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "articulo_autor")
public class Articulo_Autor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_articulo", nullable = false)
    @JsonBackReference
    private Articulos articulo;

    @ManyToOne
    @JoinColumn(name = "id_autor", nullable = false)
    @JsonBackReference
    private Autor autor;

    @Column()
    private String rol_autor; // El nuevo campo que quieres agregar

}
