package com.unsis.spring.app.Entity.BD1;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="articulo")
public class Articulos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_articulo;

    @ManyToOne
    @JoinColumn(name = "id_publicacion_tipo", nullable = false)
    private Tipo_Publicacion tipo_Publicacion;
    
    @Column(nullable = false)
    private Date fecha_publicacion;

    @Column(nullable = false)
    private String titulo_revista;

    @Column(nullable = false)
    private Integer numero_revista;

    @Column(nullable = false)
    private String volumen_revista;

    @Column(nullable = false)
    private Integer pag_inicio;

    @Column(nullable = false)
    private Integer pag_final;

    @Column
    private String doi;
    
    @Column
    private String isbn_impreso;

    @Column
    private String isbn_digital;
}
