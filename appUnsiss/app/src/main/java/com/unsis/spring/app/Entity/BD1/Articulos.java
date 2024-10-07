package com.unsis.spring.app.Entity.BD1;

import java.text.Normalizer;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "articulos")
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

    // Nueva relación uno a uno con FileMetadata
    @OneToOne
    @JoinColumn(name = "file_metadata_id")
    private FileMetadata fileMetadata;

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

    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<Articulo_Autor> autoresArticulos = new HashSet<>();

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
    private String observaciones_investigador;

    @Column
    private String indice_miar;

    @Column(nullable = false)
    private boolean compilado;

    @Column(nullable = false)
    private boolean financiamiento_prodep;

    @Column(nullable = false)
    private boolean aceptado_director;

    @Column(nullable = false)
    private boolean aceptado_gestion;

    @Column(nullable = false)
    private Integer estatus;

    // Constructor con todos los parámetros
    public Articulos(Long id_articulo, Tipo_Publicacion tipo_Publicacion, Instituto instituto, Date fecha_publicacion,
            String titulo_revista, Integer numero_revista, String volumen_revista, Integer pag_inicio,
            Integer pag_final, String doi, String isbn_impreso, String isbn_digital, String nombre_articulo,
            String editorial, String nombre_capitulo, String observaciones_directores, String observaciones_gestion,
            String observaciones_investigador, String indice_miar, boolean compilado, Trimestre trimestre, 
            boolean financiamiento_prodep, FileMetadata fileMetadata, boolean aceptado_director, boolean aceptado_gestion, 
            Integer estatus) {

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
        this.nombre_articulo = nombre_articulo;
        this.editorial = editorial;
        this.nombre_capitulo = nombre_capitulo;
        this.observaciones_directores = observaciones_directores;
        this.observaciones_gestion = observaciones_gestion;
        this.observaciones_investigador = observaciones_investigador;
        this.indice_miar = indice_miar;
        this.compilado = compilado;
        this.trimestre = trimestre;
        this.financiamiento_prodep = financiamiento_prodep;
        this.fileMetadata = fileMetadata;
        this.aceptado_director = aceptado_director;
        this.aceptado_gestion = aceptado_gestion;
        this.estatus = estatus;
    }

    @Transient
    private String tituloNormalizado;

    // Método para normalizar el título
    public String getTituloNormalizado() {
        if (nombre_articulo == null) {
            return null;
        }
        // Normalizar acentos, convertir a minúsculas y eliminar espacios adicionales
        return Normalizer.normalize(nombre_articulo, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("\\s+", " ") // Reemplaza múltiples espacios por uno solo
                .trim(); // Elimina espacios al inicio y al final
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Articulos articulos = (Articulos) o;
        return id_articulo != null && id_articulo.equals(articulos.id_articulo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id_articulo);
    }

}