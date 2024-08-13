package com.unsis.spring.app.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

import com.unsis.spring.app.Entity.BD1.FileMetadata;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloDto {
    private Long id_articulo;
    private Tipo_PublicacionDto tipoPublicacion;
    private InstitutoDto instituto;
    private Date fecha_publicacion;
    private String titulo_revista;
    private Integer numero_revista;
    private String volumen_revista;
    private Integer pag_inicio;
    private Integer pag_final;
    private String doi;
    private String isbn_impreso;
    private String isbn_digital;
    private String nombre_articulo;
    private String editorial;
    private String nombre_capitulo;
    private String observaciones_directores;
    private String observaciones_gestion;
    private String indice_miar;
    private boolean compilado;
    private TrimestreDto trimestre;
    private boolean financiamiento_prodep;
    private FileMetadata fileMetadata;
    private boolean aceptado_director;
    private boolean aceptado_gestion;
    private Integer estatus;
}