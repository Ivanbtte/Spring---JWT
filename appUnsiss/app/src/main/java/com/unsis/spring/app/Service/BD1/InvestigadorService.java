package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.Entity.BD1.Investigador;

public interface InvestigadorService {

    public List<Investigador> findAll();
	
	public Investigador save(Investigador rol);
	
	public Investigador findById(Long id);
	
	public void delete(Investigador rol);
    
}
