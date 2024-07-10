package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.InstitutoDto;

public interface InstitutoService {

   	List<InstitutoDto> findAll();
	
	InstitutoDto save(InstitutoDto institutoDto);
	
	InstitutoDto findById(Long id);
	
	void delete(Long id);
    
}
