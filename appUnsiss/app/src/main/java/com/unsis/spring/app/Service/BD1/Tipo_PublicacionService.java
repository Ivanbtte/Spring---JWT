package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.Tipo_PublicacionDto;

public interface Tipo_PublicacionService {
	
	List<Tipo_PublicacionDto> findAll();
    
    Tipo_PublicacionDto save(Tipo_PublicacionDto tipoPublicacionDto);
    
    Tipo_PublicacionDto findById(Long id);
    
    void delete(Long id);
}
