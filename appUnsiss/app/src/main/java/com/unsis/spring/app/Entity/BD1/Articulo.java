package com.unsis.spring.app.Entity.BD1;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="articulo")
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_articulo;

    @OneToMany
    @JoinColumn(name = "id_publicacion_tipo", nullable = false)
    private Tipo_Publicacion tipo_Publicacion;
    
    @JoinColumn(nullable = false)
    private Date fecha_publicacion;

    @JoinColumn(nullable = false)
    private String titulo_revista;

    @JoinColumn(nullable = false)
    private Integer numero_revista;

    @JoinColumn(nullable = false)
    private String volumen_revista;

    @JoinColumn(nullable = false)
    private Integer pag_inicio;

    @JoinColumn(nullable = false)
    private Integer pag_final;

    @JoinColumn(nullable = false)
    private String doi;
    
    @JoinColumn(nullable = false)
    private String isbn_impreso;

    @JoinColumn(nullable = false)
    private String isbn_digital;
}
