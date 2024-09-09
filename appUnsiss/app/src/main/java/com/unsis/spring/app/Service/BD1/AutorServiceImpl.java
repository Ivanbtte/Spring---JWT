package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.ExceptionHandler.ResourceNotFoundException;
import com.unsis.spring.app.Repository.BD1.AutorDao;

import jakarta.transaction.Transactional;

@Service
public class AutorServiceImpl implements AutorService {

    @Autowired
    private AutorDao autorDao;

    @Override
    @Transactional
    public List<AutorDto> findAll() {
        return autorDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AutorDto save(AutorDto autorDto) {
        Autor autor = convertToEntity(autorDto);
        Autor savedAutor = autorDao.save(autor);
        return convertToDto(savedAutor);
    }

    @Override
    public AutorDto findById(Long id) {
        Autor autor = autorDao.findById(id).orElse(null);
        return convertToDto(autor);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        autorDao.deleteById(id);
    }

    public AutorDto convertToDto(Autor autor) {
        if (autor == null)
            return null;
        return new AutorDto(
                autor.getId_autor(),
                autor.getNombre1Autor(),
                autor.getNombre2Autor(),
                autor.getApellidoPaternoAutor(),
                autor.getApellidoMaternoAutor(),
                autor.getAutorUnsis());
    }

    public Autor convertToEntity(AutorDto autorDto) {
        Autor autor = new Autor(
                autorDto.getId_autor(),
                autorDto.getNombre1Autor(),
                autorDto.getNombre2Autor(),
                autorDto.getApellidoPaternoAutor(),
                autorDto.getApellidoMaternoAutor(),
                autorDto.getAutorUnsis(),
                new HashSet<>());
        return autor;
    }

    @Override
    public Autor findByIdAutor(Long id) {
        return autorDao.findById(id).orElse(null);

    }

    @Override
    @Transactional
    public Autor saveAutor(Autor autor) {
        return autorDao.save(autor);
    }

    @Override
    public List<AutorDto> findAllArt(Long idArticulo) {
        return autorDao.findAutoresByArticuloId(idArticulo).stream()
                .map(objArray -> new AutorDto(
                        (Long) objArray[0], // id_autor
                        (String) objArray[1], // nombre1Autor
                        (String) objArray[2], // nombre2Autor
                        (String) objArray[3], // apellidoPaternoAutor
                        (String) objArray[4], // apellidoMaternoAutor
                        (Boolean) objArray[5] // autorUnsis
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAutorArticuloRelation(Long idautor, Long idart) {
        // Eliminar la relación entre el autor y el artículo
        autorDao.deleteAutorArticuloRelation(idautor, idart);
    }

    @Override  
    @Transactional
    public void deleteAutorNoArticuloRelation(Long idautor, Long idart) {
       // Eliminar la relación entre el autor y el artículo
       autorDao.deleteAutorArticuloRelation(idautor, idart);

       // Eliminar el autor si no es UNSIS
       autorDao.deleteAutorIfNotUnsis(idautor);  
    }

}
