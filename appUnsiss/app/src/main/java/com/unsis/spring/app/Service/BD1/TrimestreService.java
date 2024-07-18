package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.TrimestreDto;

public interface TrimestreService {
    
    List<TrimestreDto> findAll();
	
	TrimestreDto save(TrimestreDto trimestreDto);
	
	TrimestreDto findById(Long id);
	
	void delete(Long id);
}
