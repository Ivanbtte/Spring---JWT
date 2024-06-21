package com.unsis.spring.app.Service.BD1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.Repository.BD1.AutorDao;

import jakarta.transaction.Transactional;

@Service
public class AutorServiceImpl implements AutorService {

    @Autowired
    private AutorDao autorDao;

    @Override
    @Transactional
    public List<Autor> findAll() {
        return (List<Autor>) autorDao.findAll();
    }

    @Override
    @Transactional
    public Autor save(Autor autor) {
        return autorDao.save(autor);
    }

    @Override
    public Autor findById(Long id) {
        return autorDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void delete(Autor autor) {
        autorDao.delete(autor);
    }
    
}
