package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.Date;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.DTO.CitaApaDto;
import com.unsis.spring.app.DTO.InstitutoDto;
import com.unsis.spring.app.DTO.Tipo_PublicacionDto;
import com.unsis.spring.app.DTO.TrimestreDto;
import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Entity.BD1.Trimestre;
import com.unsis.spring.app.ExceptionHandler.ResourceNotFoundException;
import com.unsis.spring.app.Repository.BD1.ArticuloDao;
import com.unsis.spring.app.Repository.BD1.InstitutoDao;
import com.unsis.spring.app.Repository.BD1.Tipo_PublicacionDao;
import com.unsis.spring.app.Repository.BD1.TrimestreDao;

import jakarta.transaction.Transactional;

import java.util.stream.Collectors;

@Service
public class ArticuloServiceImpl implements ArticuloService {

    @Autowired
    private ArticuloDao articuloDao;

    @Autowired
    private Tipo_PublicacionDao tipoPublicacionDao;

    @Autowired
    private InstitutoDao institutoDao;

    @Autowired
    private TrimestreDao trimestreDao;

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
        if (articulo == null)
            return null;
        Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                articulo.getTipo_Publicacion().getId_publicacion_tipo(),
                articulo.getTipo_Publicacion().getDescripcion_publicacion_tipo());
        InstitutoDto institutoDto = new InstitutoDto(articulo.getInstituto().getId(),
                articulo.getInstituto().getNombre());
        TrimestreDto trimestreDto = new TrimestreDto(articulo.getTrimestre().getId_trimestre(), articulo.getTrimestre().getNombre(), articulo.getTrimestre().getFecha_inicio(), articulo.getTrimestre().getFecha_fin());

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
                articulo.getIsbn_digital(),
                articulo.getNombre_articulo(),
                articulo.getEditorial(),
                articulo.getNombre_capitulo(),
                articulo.getObservaciones_directores(),
                articulo.getObservaciones_gestion(),
                articulo.getIndice_miar(),
                articulo.isCompilado(),
                trimestreDto,
                articulo.isFinanciamiento_prodep());
    }

    @Override
    public Articulos convertToEntity(ArticuloDto articuloDto) {
        Tipo_Publicacion tipoPublicacion = tipoPublicacionDao
                .findById(articuloDto.getTipoPublicacion().getId_publicacion_tipo()).orElse(null);
        Instituto instituto = institutoDao.findById(articuloDto.getInstituto().getId()).orElse(null);
        Trimestre trimestre = trimestreDao.findById(articuloDto.getTrimestre().getId_trimestre()).orElse(null);

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
                new HashSet<>(),
                articuloDto.getNombre_articulo(),
                articuloDto.getEditorial(),
                articuloDto.getNombre_capitulo(),
                articuloDto.getObservaciones_directores(),
                articuloDto.getObservaciones_gestion(),
                articuloDto.getIndice_miar(),
                articuloDto.isCompilado(),
                trimestre,
                articuloDto.isFinanciamiento_prodep());
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

    @Override
    public CitaApaDto getCitaApaById(Long id) {
        List<Object[]> results = articuloDao.findArticuloWithAutoresById(id);

        if (results.isEmpty()) {
            throw new ResourceNotFoundException("Articulo not found");
        }

        Object[] firstResult = results.get(0);

        Articulos articulo = new Articulos();
        articulo.setId_articulo((Long) firstResult[0]);
        articulo.setDoi((String) firstResult[1]);
        articulo.setFecha_publicacion((Date) firstResult[2]);
        articulo.setIsbn_digital((String) firstResult[3]);
        articulo.setIsbn_impreso((String) firstResult[4]);
        articulo.setNumero_revista((Integer) firstResult[5]);
        articulo.setPag_final((Integer) firstResult[6]);
        articulo.setPag_inicio((Integer) firstResult[7]);
        articulo.setTitulo_revista((String) firstResult[8]);
        articulo.setVolumen_revista((String) firstResult[9]);

        // Obtener los IDs de las llaves foráneas
        Long idInstituto = (Long) firstResult[10];
        Long idTipoPublicacion = (Long) firstResult[11];

        // Buscar las entidades de Instituto y Tipo_Publicacion basadas en los IDs
        Instituto instituto = institutoDao.findById(idInstituto)
                .orElseThrow(() -> new ResourceNotFoundException("Instituto not found"));
        Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo_Publicacion not found"));

        articulo.setInstituto(instituto);
        articulo.setTipo_Publicacion(tipoPublicacion);

        Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                tipoPublicacion.getId_publicacion_tipo(),
                tipoPublicacion.getDescripcion_publicacion_tipo());

        InstitutoDto institutoDto = new InstitutoDto(
                instituto.getId(),
                instituto.getNombre());

        List<AutorDto> autoresDto = results.stream().map(result -> {
            AutorDto autorDto = new AutorDto();
            autorDto.setId_autor((Long) result[12]);
            autorDto.setApellidoMaternoAutor((String) result[13]);
            autorDto.setApellidoPaternoAutor((String) result[14]);
            autorDto.setAutorUnsis((Boolean) result[15]);
            autorDto.setNombre1Autor((String) result[16]);
            autorDto.setNombre2Autor((String) result[17]);
            return autorDto;
        }).collect(Collectors.toList());

        return new CitaApaDto(
                articulo.getId_articulo(),
                tipoPublicacionDto.getDescripcion_publicacion_tipo(),
                institutoDto.getNombre(),
                articulo.getFecha_publicacion(),
                articulo.getTitulo_revista(),
                articulo.getNumero_revista(),
                articulo.getVolumen_revista(),
                articulo.getPag_inicio(),
                articulo.getPag_final(),
                articulo.getDoi(),
                articulo.getIsbn_impreso(),
                articulo.getIsbn_digital(),
                autoresDto);
    }
}