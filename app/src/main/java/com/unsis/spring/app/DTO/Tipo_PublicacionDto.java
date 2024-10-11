package com.unsis.spring.app.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tipo_PublicacionDto {
    private Long id_publicacion_tipo;
    private String descripcion_publicacion_tipo;
    //private List<ArticuloDto> articulos;
}

