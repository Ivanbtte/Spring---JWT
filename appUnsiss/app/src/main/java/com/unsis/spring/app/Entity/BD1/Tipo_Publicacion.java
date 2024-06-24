package com.unsis.spring.app.Entity.BD1;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name="tipo_publicacion")
public class Tipo_Publicacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_publicacion_tipo;

    @Column(name = "descripcion_publicacion_tipo", nullable = false, columnDefinition = "TEXT")
    private String descripcion_publicacion_tipo;

    @OneToMany(mappedBy = "tipo_Publicacion")
    private List<Articulos> articulos;
}
