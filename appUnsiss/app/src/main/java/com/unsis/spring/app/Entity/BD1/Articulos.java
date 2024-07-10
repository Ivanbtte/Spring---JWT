package com.unsis.spring.app.Entity.BD1;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name="articulo")
public class Articulos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_articulo;

    @ManyToOne
    @JoinColumn(name = "id_publicacion_tipo", nullable = false)
    @JsonBackReference
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

    @ManyToMany
    @JoinTable(
        name = "articulo_autor",
        joinColumns = @JoinColumn(name = "id_articulo"),
        inverseJoinColumns = @JoinColumn(name = "id_autor")
    )
    private Set<Autor> autores = new HashSet<>();

    // Constructor sin parámetros
    public Articulos() {}

    // Constructor con todos los parámetros
    public Articulos(Long id_articulo, Tipo_Publicacion tipo_Publicacion, Date fecha_publicacion, String titulo_revista,
                     Integer numero_revista, String volumen_revista, Integer pag_inicio, Integer pag_final,
                     String doi, String isbn_impreso, String isbn_digital, Set<Autor> autores) {
        this.id_articulo = id_articulo;
        this.tipo_Publicacion = tipo_Publicacion;
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
    }

    // Getters and setters
    public Long getId_articulo() {
        return id_articulo;
    }

    public void setId_articulo(Long id_articulo) {
        this.id_articulo = id_articulo;
    }

    public Tipo_Publicacion getTipo_Publicacion() {
        return tipo_Publicacion;
    }

    public void setTipo_Publicacion(Tipo_Publicacion tipo_Publicacion) {
        this.tipo_Publicacion = tipo_Publicacion;
    }

    public Date getFecha_publicacion() {
        return fecha_publicacion;
    }

    public void setFecha_publicacion(Date fecha_publicacion) {
        this.fecha_publicacion = fecha_publicacion;
    }

    public String getTitulo_revista() {
        return titulo_revista;
    }

    public void setTitulo_revista(String titulo_revista) {
        this.titulo_revista = titulo_revista;
    }

    public Integer getNumero_revista() {
        return numero_revista;
    }

    public void setNumero_revista(Integer numero_revista) {
        this.numero_revista = numero_revista;
    }

    public String getVolumen_revista() {
        return volumen_revista;
    }

    public void setVolumen_revista(String volumen_revista) {
        this.volumen_revista = volumen_revista;
    }

    public Integer getPag_inicio() {
        return pag_inicio;
    }

    public void setPag_inicio(Integer pag_inicio) {
        this.pag_inicio = pag_inicio;
    }

    public Integer getPag_final() {
        return pag_final;
    }

    public void setPag_final(Integer pag_final) {
        this.pag_final = pag_final;
    }

    public String getDoi() {
        return doi;
    }

    public void setDoi(String doi) {
        this.doi = doi;
    }

    public String getIsbn_impreso() {
        return isbn_impreso;
    }

    public void setIsbn_impreso(String isbn_impreso) {
        this.isbn_impreso = isbn_impreso;
    }

    public String getIsbn_digital() {
        return isbn_digital;
    }

    public void setIsbn_digital(String isbn_digital) {
        this.isbn_digital = isbn_digital;
    }

    public Set<Autor> getAutores() {
        return autores;
    }

    public void setAutores(Set<Autor> autores) {
        this.autores = autores;
    }
}