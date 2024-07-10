package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Repository.BD1.ArticuloDao;
import com.unsis.spring.app.Repository.BD1.Tipo_PublicacionDao;

import jakarta.transaction.Transactional;

import java.util.stream.Collectors;

@Service
public class ArticuloServiceImpl implements ArticuloService {

    @Autowired
    private ArticuloDao articuloDao;

    @Autowired
    private Tipo_PublicacionDao tipoPublicacionDao;

    @Autowired
    @Lazy
    private AutorService autorService;

    @Override
    @Transactional
    public List<ArticuloDto> findAll() {
        return articuloDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ArticuloDto save(ArticuloDto articuloDto) {
        Articulos articulo = convertToEntity(articuloDto);
        Articulos savedArticulo = articuloDao.save(articulo);
        return convertToDto(savedArticulo);
    }

    @Override
    public ArticuloDto findById(Long id) {
        Articulos articulo = articuloDao.findById(id).orElse(null);
        return convertToDto(articulo);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        articuloDao.deleteById(id);
    }

    @Override
    public List<ArticuloDto> findArticulosByAutorId(Long autorId) {
        return articuloDao.findArticulosByAutorId(autorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ArticuloDto convertToDto(Articulos articulo) {
        if (articulo == null) return null;
        List<AutorDto> autoresDto = articulo.getAutores().stream()
                .map(autorService::convertToDto)
                .collect(Collectors.toList());
        return new ArticuloDto(
                articulo.getId_articulo(),
                articulo.getTipo_Publicacion().getId_publicacion_tipo(),
                articulo.getFecha_publicacion(),
                articulo.getTitulo_revista(),
                articulo.getNumero_revista(),
                articulo.getVolumen_revista(),
                articulo.getPag_inicio(),
                articulo.getPag_final(),
                articulo.getDoi(),
                articulo.getIsbn_impreso(),
                articulo.getIsbn_digital(),
                autoresDto
        );
    }

    @Override
	public Articulos convertToEntity(ArticuloDto articuloDto) {
    Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(articuloDto.getTipoPublicacionId()).orElse(null);
    Articulos articulo = new Articulos(
            articuloDto.getId_articulo(),
            tipoPublicacion,
            articuloDto.getFecha_publicacion(),
            articuloDto.getTitulo_revista(),
            articuloDto.getNumero_revista(),
            articuloDto.getVolumen_revista(),
            articuloDto.getPag_inicio(),
            articuloDto.getPag_final(),
            articuloDto.getDoi(),
            articuloDto.getIsbn_impreso(),
            articuloDto.getIsbn_digital(),
            new HashSet<>()
    );
    articulo.setAutores(articuloDto.getAutores().stream()
            .map(autorService::convertToEntity)
            .collect(Collectors.toSet()));
    return articulo;
}
}