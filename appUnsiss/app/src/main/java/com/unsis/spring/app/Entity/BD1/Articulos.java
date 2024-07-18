package com.unsis.spring.app.Entity.BD1;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="articulos")
public class Articulos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_articulo;

    @ManyToOne
    @JoinColumn(name = "id_publicacion_tipo", nullable = false)
    @JsonBackReference
    private Tipo_Publicacion tipo_Publicacion;

    @ManyToOne
    @JoinColumn(name = "id_instituto", nullable = false)
    private Instituto instituto;

    @ManyToOne
    @JoinColumn(name = "id_trimestre", nullable = false)
    private Trimestre trimestre;

    @Column(nullable = false)
    private Date fecha_publicacion;

    @Column
    private String titulo_revista;

    @Column
    private Integer numero_revista;

    @Column
    private String volumen_revista;

    @Column
    private Integer pag_inicio;

    @Column
    private Integer pag_final;

    @Column
    private String doi;

    @Column
    private String isbn_impreso;

    @Column
    private String isbn_digital;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "articulo_autor",
        joinColumns = @JoinColumn(name = "id_articulo"),
        inverseJoinColumns = @JoinColumn(name = "id_autor")
    )

    private Set<Autor> autores = new HashSet<>();

    @Column
    private String nombre_articulo;

    @Column
    private String editorial;

    @Column
    private String nombre_capitulo;

    @Column
    private String observaciones_directores;

    @Column
    private String observaciones_gestion;

    @Column
    private String indice_miar;

    @Column(nullable = false)
    private boolean compilado;

    @Column(nullable = false)
    private boolean financiamiento_prodep;


    // Constructor sin parámetros
    public Articulos() {}

    // Constructor con todos los parámetros
    public Articulos(Long id_articulo, Tipo_Publicacion tipo_Publicacion, Instituto instituto, Date fecha_publicacion, String titulo_revista,
                     Integer numero_revista, String volumen_revista, Integer pag_inicio, Integer pag_final,
                     String doi, String isbn_impreso, String isbn_digital, Set<Autor> autores, 
                     String nombre_articulo, String editorial, String nombre_capitulo, String observaciones_directores,
                     String observaciones_gestion, String indice_miar, boolean compilado, Trimestre trimestre, boolean financiamiento_prodep) {
        this.id_articulo = id_articulo;
        this.tipo_Publicacion = tipo_Publicacion;
        this.instituto = instituto;
        this.fecha_publicacion = fecha_publicacion;
        this.titulo_revista = titulo_revista;
        this.numero_revista = numero_revista;
        this.volumen_revista = volumen_revista;
        this.pag_inicio = pag_inicio;
        this.pag_final = pag_final;
        this.doi = doi;
        this.isbn_impreso = isbn_impreso;
        this.isbn_digital = isbn_digital;
        this.autores = autores;
        this.nombre_articulo = nombre_articulo;
        this.editorial = editorial;
        this.nombre_capitulo = nombre_capitulo;
        this.observaciones_directores = observaciones_directores;
        this.observaciones_gestion = observaciones_gestion;
        this.indice_miar = indice_miar;
        this.compilado = compilado;
        this.trimestre = trimestre;
        this.financiamiento_prodep = financiamiento_prodep;
    }

    // Getters y setters para los nuevos campos

    public String getNombre_articulo() {
        return nombre_articulo;
    }

    public void setNombre_articulo(String nombre_articulo) {
        this.nombre_articulo = nombre_articulo;
    }

    public String getEditorial() {
        return editorial;
    }

    public void setEditorial(String editorial) {
        this.editorial = editorial;
    }

    public String getNombre_capitulo() {
        return nombre_capitulo;
    }

    public void setNombre_capitulo(String nombre_capitulo) {
        this.nombre_capitulo = nombre_capitulo;
    }

    public String getObservaciones_directores() {
        return observaciones_directores;
    }

    public void setObservaciones_directores(String observaciones_directores) {
        this.observaciones_directores = observaciones_directores;
    }

    public String getObservaciones_gestion() {
        return observaciones_gestion;
    }

    public void setObservaciones_gestion(String observaciones_gestion) {
        this.observaciones_gestion = observaciones_gestion;
    }

    public String getIndice_miar() {
        return indice_miar;
    }

    public void setIndice_miar(String indice_miar) {
        this.indice_miar = indice_miar;
    }

    public boolean isCompilado() {
        return compilado;
    }

    public void setCompilado(boolean compilado) {
        this.compilado = compilado;
    }

    public Trimestre getTrimestre() {
        return trimestre;
    }

    public void setTrimestre(Trimestre trimestre) {
        this.trimestre = trimestre;
    }

    public boolean isFinanciamiento_prodep() {
        return financiamiento_prodep;
    }

    public void setFinanciamiento_prodep(boolean financiamiento_prodep) {
        this.financiamiento_prodep = financiamiento_prodep;
    }
}