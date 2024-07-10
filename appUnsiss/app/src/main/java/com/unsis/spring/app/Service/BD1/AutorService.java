package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.Entity.BD1.Autor;

public interface AutorService {
    public List<AutorDto> findAll();
    public AutorDto save(AutorDto autorDto);
    public AutorDto findById(Long id);
    public void delete(Long id);
    public AutorDto convertToDto(Autor autor);
    public Autor convertToEntity(AutorDto autorDto);
}