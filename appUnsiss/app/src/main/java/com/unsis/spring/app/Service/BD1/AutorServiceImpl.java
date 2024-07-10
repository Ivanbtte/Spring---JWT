package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.Repository.BD1.AutorDao;

import jakarta.transaction.Transactional;

@Service
public class AutorServiceImpl implements AutorService {

    @Autowired
    private AutorDao autorDao;

    @Autowired
    @Lazy
    private ArticuloService articuloService;

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
        if (autor == null) return null;
        List<ArticuloDto> articulosDto = autor.getArticulos().stream()
                .map(articuloService::convertToDto)
                .collect(Collectors.toList());
        return new AutorDto(
                autor.getId_autor(),
                autor.getNombre1Autor(),
                autor.getNombre2Autor(),
                autor.getApellidoPaternoAutor(),
                autor.getApellidoMaternoAutor(),
                autor.getAutorUnsis(),
                articulosDto
        );
    }

    public Autor convertToEntity(AutorDto autorDto) {
        Autor autor = new Autor(
                autorDto.getId_autor(),
                autorDto.getNombre1Autor(),
                autorDto.getNombre2Autor(),
                autorDto.getApellidoPaternoAutor(),
                autorDto.getApellidoMaternoAutor(),
                autorDto.getAutorUnsis(),
                new HashSet<>()
        );
        autor.setArticulos(autorDto.getArticulos().stream()
                .map(articuloService::convertToEntity)
                .collect(Collectors.toSet()));
        return autor;
    }
}
