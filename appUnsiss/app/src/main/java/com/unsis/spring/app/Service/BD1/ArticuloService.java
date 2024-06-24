package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.Entity.BD1.Articulo;

public interface ArticuloService {
    
    public List<Articulo> findAll();
	
	public Articulo save(Articulo art);
	
	public Articulo findById(Long id);
	
	public void delete(Articulo art);
    
}