package com.unsis.spring.app.DTO;

import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Autor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Articulo_AutorDto {
    private Articulos articulo;
    private Autor autor;
    private String rol_autor;
}
