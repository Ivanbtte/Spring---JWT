package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.Entity.BD1.Articulos;

public interface ArticuloService {
    
    public List<Articulos> findAll();
	
	public Articulos save(Articulos art);
	
	public Articulos findById(Long id);
	
	public void delete(Articulos art);
    
}