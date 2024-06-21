package com.unsis.spring.app.Service.BD1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Repository.BD1.Tipo_PublicacionDao;

import jakarta.transaction.Transactional;

@Service
public class Tipo_PublicacionServiceImpl implements Tipo_PublicacionService{

    @Autowired
    private Tipo_PublicacionDao tipo_PublicacionDao;

    @Override
    @Transactional
    public List<Tipo_Publicacion> findAll() {
        return (List<Tipo_Publicacion>) tipo_PublicacionDao.findAll();
    }

    @Override
    @Transactional
    public Tipo_Publicacion save(Tipo_Publicacion tipo_Publicacion) {
        return tipo_PublicacionDao.save(tipo_Publicacion);
    }

    @Override
    public Tipo_Publicacion findById(Long id) {
        return tipo_PublicacionDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void delete(Tipo_Publicacion tipo_Publicacion) {
        tipo_PublicacionDao.delete(tipo_Publicacion);
    }
    
}
