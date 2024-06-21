package com.unsis.spring.app.Service.BD1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Entity.BD1.Investigador;
import com.unsis.spring.app.Repository.BD1.InvestigadorDao;

import jakarta.transaction.Transactional;

@Service
public class InvestigadorServiceImpl implements InvestigadorService{
    
    @Autowired
	private InvestigadorDao investigadorDao;
	
	@Override
	@Transactional
	public List<Investigador> findAll() {
		return (List<Investigador>) investigadorDao.findAll();
	}

	@Override
	@Transactional
	public Investigador save(Investigador investigador) {
		return investigadorDao.save(investigador);
	}

	@Override 
	public Investigador findById(Long id) {
		return investigadorDao.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void delete(Investigador investigador) {
		investigadorDao.delete(investigador);
		
	}
}
