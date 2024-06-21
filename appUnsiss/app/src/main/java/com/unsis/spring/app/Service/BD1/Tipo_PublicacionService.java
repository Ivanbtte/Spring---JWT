package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;

public interface Tipo_PublicacionService {
    public List<Tipo_Publicacion> findAll();
	
	public Tipo_Publicacion save(Tipo_Publicacion tipo_Publicacion);
	
	public Tipo_Publicacion findById(Long id);
	
	public void delete(Tipo_Publicacion tipo_Publicacion);
}
