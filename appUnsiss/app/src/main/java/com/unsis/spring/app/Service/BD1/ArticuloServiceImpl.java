package com.unsis.spring.app.Service.BD1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Repository.BD1.ArticuloDao;

import jakarta.transaction.Transactional;

@Service
public class ArticuloServiceImpl implements ArticuloService{
    @Autowired
	private ArticuloDao articuloDao;
	
	@Override
	@Transactional
	public List<Articulos> findAll() {
		return (List<Articulos>) articuloDao.findAll();
	}

	@Override
	@Transactional
	public Articulos save(Articulos articulo) {
		return articuloDao.save(articulo);
	}

	@Override 
	public Articulos findById(Long id) {
		return articuloDao.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void delete(Articulos articulo) {
		articuloDao.delete(articulo);
		
	}
}
