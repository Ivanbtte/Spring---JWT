package com.unsis.spring.app.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutorDto {
    private Long id_autor;
    private String nombre1Autor;
    private String nombre2Autor;
    private String apellidoPaternoAutor;
    private String apellidoMaternoAutor;
    private Boolean autorUnsis;
    private List<ArticuloDto> articulos;
}