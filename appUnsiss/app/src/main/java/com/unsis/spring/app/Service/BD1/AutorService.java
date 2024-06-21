package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.Entity.BD1.Autor;

public interface AutorService {
    public List<Autor> findAll();
	
	public Autor save(Autor autor);
	
	public Autor findById(Long id);
	
	public void delete(Autor autor);
}
