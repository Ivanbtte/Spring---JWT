package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.Entity.BD1.Instituto;

public interface InstitutoService {

    public List<Instituto> findAll();
	
	public Instituto save(Instituto rol);
	
	public Instituto findById(Long id);
	
	public void delete(Instituto rol);
    
}
