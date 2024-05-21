package com.unsis.spring.app.Service.BD1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Repository.BD1.InstitutoDao;

import jakarta.transaction.Transactional;

@Service
public class InstitutoServiceImpl implements InstitutoService{
    
    @Autowired
	private InstitutoDao institutoDao;
	
	@Override
	@Transactional
	public List<Instituto> findAll() {
		return (List<Instituto>) institutoDao.findAll();
	}

	@Override
	@Transactional
	public Instituto save(Instituto instituto) {
		return institutoDao.save(instituto);
	}

	@Override 
	public Instituto findById(Long id) {
		return institutoDao.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void delete(Instituto instituto) {
		institutoDao.delete(instituto);
		
	}
}
