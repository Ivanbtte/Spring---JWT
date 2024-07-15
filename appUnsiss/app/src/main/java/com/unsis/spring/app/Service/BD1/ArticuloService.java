package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.Entity.BD1.Articulos;

public interface ArticuloService {
    public List<ArticuloDto> findAll();
    public ArticuloDto save(ArticuloDto articuloDto);
    public Articulos saveArticulo(Articulos articulo);
    public ArticuloDto findById(Long id);
    public Articulos findByIdArticulo(Long id);
    public void delete(Long id);
    public List<Articulos> findArticulosByAutorId(Long autorId);
    public ArticuloDto convertToDto(Articulos articulo);
    public Articulos convertToEntity(ArticuloDto articuloDto);
}