package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.DTO.InstitutoDto;
import com.unsis.spring.app.DTO.Tipo_PublicacionDto;
import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Repository.BD1.ArticuloDao;
import com.unsis.spring.app.Repository.BD1.InstitutoDao;
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

    @Autowired
    private InstitutoDao institutoDao;

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
	// Método para obtener artículos por ID del autor
	@Transactional
    public List<Articulos> findArticulosByAutorId(Long autorId) {
        return articuloDao.findArticulosByAutorId(autorId);
    }

     @Override
    public ArticuloDto convertToDto(Articulos articulo) {
        if (articulo == null) return null;
        Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(articulo.getTipo_Publicacion().getId_publicacion_tipo(), articulo.getTipo_Publicacion().getDescripcion_publicacion_tipo());
        InstitutoDto institutoDto = new InstitutoDto(articulo.getInstituto().getId(), articulo.getInstituto().getNombre());

        return new ArticuloDto(
                articulo.getId_articulo(),
                tipoPublicacionDto,
                institutoDto,
                articulo.getFecha_publicacion(),
                articulo.getTitulo_revista(),
                articulo.getNumero_revista(),
                articulo.getVolumen_revista(),
                articulo.getPag_inicio(),
                articulo.getPag_final(),
                articulo.getDoi(),
                articulo.getIsbn_impreso(),
                articulo.getIsbn_digital()
        );
    }

   @Override
    public Articulos convertToEntity(ArticuloDto articuloDto) {
        Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(articuloDto.getTipoPublicacion().getId_publicacion_tipo()).orElse(null);
        Instituto instituto = institutoDao.findById(articuloDto.getInstituto().getId()).orElse(null);

        return new Articulos(
                articuloDto.getId_articulo(),
                tipoPublicacion,
                instituto,
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
    }

@Override
public Articulos findByIdArticulo(Long id) {
    return articuloDao.findById(id).orElse(null);
}

@Override
@Transactional
public Articulos saveArticulo(Articulos articulo) {
    return articuloDao.save(articulo);
}

}