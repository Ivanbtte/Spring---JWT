package com.unsis.spring.app.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloDto {
    private Long id_articulo;
    private Long tipoPublicacionId;
    private Date fecha_publicacion;
    private String titulo_revista;
    private Integer numero_revista;
    private String volumen_revista;
    private Integer pag_inicio;
    private Integer pag_final;
    private String doi;
    private String isbn_impreso;
    private String isbn_digital;
    private List<AutorDto> autores;
}