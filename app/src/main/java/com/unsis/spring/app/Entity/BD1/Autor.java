package com.unsis.spring.app.Entity.BD1;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<Articulo_Autor> articulosAutores = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Autor autor = (Autor) o;
        return id_autor != null && id_autor.equals(autor.id_autor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id_autor);
    }
}
