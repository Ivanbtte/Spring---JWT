package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.Tipo_PublicacionDto;
import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Repository.BD1.Tipo_PublicacionDao;

import jakarta.transaction.Transactional;

@Service
public class Tipo_PublicacionServiceImpl implements Tipo_PublicacionService{

    @Autowired
    private Tipo_PublicacionDao tipo_PublicacionDao;

    @Override
    @Transactional
    public List<Tipo_PublicacionDto> findAll() {
        return tipo_PublicacionDao.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Tipo_PublicacionDto save(Tipo_PublicacionDto tipoPublicacionDto) {
        Tipo_Publicacion tipoPublicacion = convertToEntity(tipoPublicacionDto);
        Tipo_Publicacion savedTipoPublicacion = tipo_PublicacionDao.save(tipoPublicacion);
        return convertToDto(savedTipoPublicacion);
    }

    @Override
    public Tipo_PublicacionDto findById(Long id) {
        Tipo_Publicacion tipoPublicacion = tipo_PublicacionDao.findById(id).orElse(null);
        return convertToDto(tipoPublicacion);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        tipo_PublicacionDao.deleteById(id);
    }
    
    private Tipo_PublicacionDto convertToDto(Tipo_Publicacion tipoPublicacion) {
        if (tipoPublicacion == null) return null;
        return new Tipo_PublicacionDto(tipoPublicacion.getId_publicacion_tipo(), tipoPublicacion.getDescripcion_publicacion_tipo());
    }

    private Tipo_Publicacion convertToEntity(Tipo_PublicacionDto tipoPublicacionDto) {
        return new Tipo_Publicacion(tipoPublicacionDto.getId_publicacion_tipo(), tipoPublicacionDto.getDescripcion_publicacion_tipo(), null);
    }
}
