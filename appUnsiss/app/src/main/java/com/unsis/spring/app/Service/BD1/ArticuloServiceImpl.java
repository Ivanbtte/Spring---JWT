package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Entity.BD1.Trimestre;
import com.unsis.spring.app.ExceptionHandler.ResourceNotFoundException;
import com.unsis.spring.app.Repository.BD1.ArticuloDao;
import com.unsis.spring.app.Repository.BD1.FileMetadataRepository;
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

        @Autowired
        private FileMetadataRepository fileMetadataRepository;

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
                TrimestreDto trimestreDto = new TrimestreDto(articulo.getTrimestre().getId_trimestre(),
                                articulo.getTrimestre().getNombre(), articulo.getTrimestre().getFecha_inicio(),
                                articulo.getTrimestre().getFecha_fin());
                FileMetadata fileMetadata = new FileMetadata(articulo.getFileMetadata().getId(),
                                articulo.getFileMetadata().getFileName(), articulo.getFileMetadata().getFilePath(),
                                articulo.getFileMetadata().getFileType());                

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
                                articulo.getCompilado(),
                                trimestreDto,
                                articulo.getFinanciamiento_prodep(),
                                fileMetadata);
        }

        @Override
        public Articulos convertToEntity(ArticuloDto articuloDto) {
                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao
                                .findById(articuloDto.getTipoPublicacion().getId_publicacion_tipo()).orElse(null);
                Instituto instituto = institutoDao.findById(articuloDto.getInstituto().getId()).orElse(null);
                Trimestre trimestre = trimestreDao.findById(articuloDto.getTrimestre().getId_trimestre()).orElse(null);
                FileMetadata fileMetadata = fileMetadataRepository.findById(articuloDto.getFileMetadata().getId()).orElse(null);

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
                                articuloDto.isFinanciamiento_prodep(),
                                fileMetadata);
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
                articulo.setId_articulo((Long) firstResult[6]);
                articulo.setDoi((String) firstResult[10]);
                articulo.setFecha_publicacion((Date) firstResult[5]);
                articulo.setIsbn_digital((String) firstResult[13]);
                articulo.setIsbn_impreso((String) firstResult[14]);
                articulo.setNumero_revista((Integer) firstResult[2]);
                articulo.setPag_final((Integer) firstResult[3]);
                articulo.setPag_inicio((Integer) firstResult[4]);
                articulo.setTitulo_revista((String) firstResult[19]);
                articulo.setVolumen_revista((String) firstResult[20]);

                // Obtener los IDs de las llaves foráneas
                Long idInstituto = (Long) firstResult[7];
                Long idTipoPublicacion = (Long) firstResult[8];
                Long idTrimestre = (Long) firstResult[9];

                articulo.setNombre_articulo((String) firstResult[15]);
                articulo.setEditorial((String) firstResult[11]);
                articulo.setNombre_capitulo((String) firstResult[16]);
                articulo.setObservaciones_directores((String) firstResult[17]);
                articulo.setObservaciones_gestion((String) firstResult[18]);
                articulo.setIndice_miar((String) firstResult[12]);
                articulo.setCompilado((Boolean) firstResult[0]);
                articulo.setFinanciamiento_prodep((Boolean) firstResult[1]);

                // Buscar las entidades de Instituto y Tipo_Publicacion basadas en los IDs
                Instituto instituto = institutoDao.findById(idInstituto)
                                .orElseThrow(() -> new ResourceNotFoundException("Instituto not found"));
                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                .orElseThrow(() -> new ResourceNotFoundException("Tipo_Publicacion not found"));
                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                .orElseThrow(() -> new ResourceNotFoundException("Trimestre not found")); // Buscar el
                                                                                                          // trimestre

                articulo.setInstituto(instituto);
                articulo.setTipo_Publicacion(tipoPublicacion);

                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                tipoPublicacion.getId_publicacion_tipo(),
                                tipoPublicacion.getDescripcion_publicacion_tipo());

                InstitutoDto institutoDto = new InstitutoDto(
                                instituto.getId(),
                                instituto.getNombre());

                TrimestreDto trimestreDto = new TrimestreDto(
                                trimestre.getId_trimestre(),
                                trimestre.getNombre(),
                                trimestre.getFecha_inicio(),
                                trimestre.getFecha_fin());

                List<AutorDto> autoresDto = results.stream().map(result -> {
                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[22]);
                        autorDto.setApellidoMaternoAutor((String) result[23]);
                        autorDto.setApellidoPaternoAutor((String) result[24]);
                        autorDto.setAutorUnsis((Boolean) result[21]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);
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
                                autoresDto,
                                articulo.getNombre_articulo(),
                                articulo.getEditorial(),
                                articulo.getNombre_capitulo(),
                                articulo.getObservaciones_directores(),
                                articulo.getObservaciones_gestion(),
                                articulo.getIndice_miar(),
                                articulo.getCompilado(),
                                articulo.getFinanciamiento_prodep(),
                                trimestreDto);
        }

        public List<CitaApaDto> getAllCitasApa() {
                List<Object[]> results = articuloDao.findAllArticulosWithAutores();

                if (results.isEmpty()) {
                        throw new ResourceNotFoundException("No se encontraron artículos");
                }

                Map<Long, CitaApaDto> articulosMap = new HashMap<>();

                for (Object[] result : results) {
                        Long articuloId = (Long) result[0];

                        if (!articulosMap.containsKey(articuloId)) {
                                Articulos articulo = new Articulos();
                                articulo.setId_articulo(articuloId);
                                articulo.setCompilado((Boolean) result[1]);
                                articulo.setDoi((String) result[2]);
                                articulo.setEditorial((String) result[3]);
                                articulo.setFecha_publicacion((Date) result[4]);
                                articulo.setFinanciamiento_prodep((Boolean) result[5]);
                                articulo.setIndice_miar((String) result[6]);
                                articulo.setIsbn_digital((String) result[7]);
                                articulo.setIsbn_impreso((String) result[8]);
                                articulo.setNombre_articulo((String) result[9]);
                                articulo.setNombre_capitulo((String) result[10]);
                                articulo.setNumero_revista((Integer) result[11]);
                                articulo.setObservaciones_directores((String) result[12]);
                                articulo.setObservaciones_gestion((String) result[13]);
                                articulo.setPag_final((Integer) result[14]);
                                articulo.setPag_inicio((Integer) result[15]);
                                articulo.setTitulo_revista((String) result[16]);
                                articulo.setVolumen_revista((String) result[17]);

                                Long idInstituto = (Long) result[18];
                                Long idTipoPublicacion = (Long) result[19];
                                Long idTrimestre = (Long) result[20];

                                Instituto instituto = institutoDao.findById(idInstituto)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Instituto no encontrado"));
                                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tipo de publicación no encontrado"));
                                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Trimestre no encontrado"));

                                articulo.setInstituto(instituto);
                                articulo.setTipo_Publicacion(tipoPublicacion);

                                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                                tipoPublicacion.getId_publicacion_tipo(),
                                                tipoPublicacion.getDescripcion_publicacion_tipo());

                                InstitutoDto institutoDto = new InstitutoDto(
                                                instituto.getId(),
                                                instituto.getNombre());

                                TrimestreDto trimestreDto = new TrimestreDto(
                                                trimestre.getId_trimestre(),
                                                trimestre.getNombre(),
                                                trimestre.getFecha_inicio(),
                                                trimestre.getFecha_fin());

                                CitaApaDto citaApaDto = new CitaApaDto(
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
                                                new ArrayList<>(),
                                                articulo.getNombre_articulo(),
                                                articulo.getEditorial(),
                                                articulo.getNombre_capitulo(),
                                                articulo.getObservaciones_directores(),
                                                articulo.getObservaciones_gestion(),
                                                articulo.getIndice_miar(),
                                                articulo.getCompilado(),
                                                articulo.getFinanciamiento_prodep(),
                                                trimestreDto);

                                articulosMap.put(articuloId, citaApaDto);
                        }

                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[21]);
                        autorDto.setApellidoMaternoAutor((String) result[22]);
                        autorDto.setApellidoPaternoAutor((String) result[23]);
                        autorDto.setAutorUnsis((Boolean) result[24]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);

                        articulosMap.get(articuloId).getAutores().add(autorDto);
                }

                return new ArrayList<>(articulosMap.values());
        }

        public List<CitaApaDto> getAllCitasApaInstituto(Long id) {
                List<Object[]> results = articuloDao.findAllArticulosWithAutoresInstituto(id);

                if (results.isEmpty()) {
                        throw new ResourceNotFoundException("No se encontraron artículos");
                }

                Map<Long, CitaApaDto> articulosMap = new HashMap<>();

                for (Object[] result : results) {
                        Long articuloId = (Long) result[0];

                        if (!articulosMap.containsKey(articuloId)) {
                                Articulos articulo = new Articulos();
                                articulo.setId_articulo(articuloId);
                                articulo.setCompilado((Boolean) result[1]);
                                articulo.setDoi((String) result[2]);
                                articulo.setEditorial((String) result[3]);
                                articulo.setFecha_publicacion((Date) result[4]);
                                articulo.setFinanciamiento_prodep((Boolean) result[5]);
                                articulo.setIndice_miar((String) result[6]);
                                articulo.setIsbn_digital((String) result[7]);
                                articulo.setIsbn_impreso((String) result[8]);
                                articulo.setNombre_articulo((String) result[9]);
                                articulo.setNombre_capitulo((String) result[10]);
                                articulo.setNumero_revista((Integer) result[11]);
                                articulo.setObservaciones_directores((String) result[12]);
                                articulo.setObservaciones_gestion((String) result[13]);
                                articulo.setPag_final((Integer) result[14]);
                                articulo.setPag_inicio((Integer) result[15]);
                                articulo.setTitulo_revista((String) result[16]);
                                articulo.setVolumen_revista((String) result[17]);

                                Long idInstituto = (Long) result[18];
                                Long idTipoPublicacion = (Long) result[19];
                                Long idTrimestre = (Long) result[20];

                                Instituto instituto = institutoDao.findById(idInstituto)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Instituto no encontrado"));
                                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tipo de publicación no encontrado"));
                                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Trimestre no encontrado"));

                                articulo.setInstituto(instituto);
                                articulo.setTipo_Publicacion(tipoPublicacion);

                                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                                tipoPublicacion.getId_publicacion_tipo(),
                                                tipoPublicacion.getDescripcion_publicacion_tipo());

                                InstitutoDto institutoDto = new InstitutoDto(
                                                instituto.getId(),
                                                instituto.getNombre());

                                TrimestreDto trimestreDto = new TrimestreDto(
                                                trimestre.getId_trimestre(),
                                                trimestre.getNombre(),
                                                trimestre.getFecha_inicio(),
                                                trimestre.getFecha_fin());

                                CitaApaDto citaApaDto = new CitaApaDto(
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
                                                new ArrayList<>(),
                                                articulo.getNombre_articulo(),
                                                articulo.getEditorial(),
                                                articulo.getNombre_capitulo(),
                                                articulo.getObservaciones_directores(),
                                                articulo.getObservaciones_gestion(),
                                                articulo.getIndice_miar(),
                                                articulo.getCompilado(),
                                                articulo.getFinanciamiento_prodep(),
                                                trimestreDto);

                                articulosMap.put(articuloId, citaApaDto);
                        }

                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[21]);
                        autorDto.setApellidoMaternoAutor((String) result[22]);
                        autorDto.setApellidoPaternoAutor((String) result[23]);
                        autorDto.setAutorUnsis((Boolean) result[24]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);

                        articulosMap.get(articuloId).getAutores().add(autorDto);
                }

                return new ArrayList<>(articulosMap.values());
        }

        public List<CitaApaDto> getAllCitasApaInstituto_Investigador(Long idInstituto, Long idInvestigador) {
                List<Object[]> results = articuloDao.findAllArticulosWithAutoresInstitutoInvestigador(idInstituto,
                                idInvestigador);

                if (results.isEmpty()) {
                        throw new ResourceNotFoundException("No se encontraron artículos");
                }

                Map<Long, CitaApaDto> articulosMap = new HashMap<>();

                for (Object[] result : results) {
                        Long articuloId = (Long) result[0];

                        if (!articulosMap.containsKey(articuloId)) {
                                Articulos articulo = new Articulos();
                                articulo.setId_articulo(articuloId);
                                articulo.setCompilado((Boolean) result[1]);
                                articulo.setDoi((String) result[2]);
                                articulo.setEditorial((String) result[3]);
                                articulo.setFecha_publicacion((Date) result[4]);
                                articulo.setFinanciamiento_prodep((Boolean) result[5]);
                                articulo.setIndice_miar((String) result[6]);
                                articulo.setIsbn_digital((String) result[7]);
                                articulo.setIsbn_impreso((String) result[8]);
                                articulo.setNombre_articulo((String) result[9]);
                                articulo.setNombre_capitulo((String) result[10]);
                                articulo.setNumero_revista((Integer) result[11]);
                                articulo.setObservaciones_directores((String) result[12]);
                                articulo.setObservaciones_gestion((String) result[13]);
                                articulo.setPag_final((Integer) result[14]);
                                articulo.setPag_inicio((Integer) result[15]);
                                articulo.setTitulo_revista((String) result[16]);
                                articulo.setVolumen_revista((String) result[17]);

                                Long idInstitutoResult = (Long) result[18];
                                Long idTipoPublicacion = (Long) result[19];
                                Long idTrimestre = (Long) result[20];

                                Instituto instituto = institutoDao.findById(idInstitutoResult)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Instituto no encontrado"));
                                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tipo de publicación no encontrado"));
                                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Trimestre no encontrado"));

                                articulo.setInstituto(instituto);
                                articulo.setTipo_Publicacion(tipoPublicacion);

                                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                                tipoPublicacion.getId_publicacion_tipo(),
                                                tipoPublicacion.getDescripcion_publicacion_tipo());

                                InstitutoDto institutoDto = new InstitutoDto(
                                                instituto.getId(),
                                                instituto.getNombre());

                                TrimestreDto trimestreDto = new TrimestreDto(
                                                trimestre.getId_trimestre(),
                                                trimestre.getNombre(),
                                                trimestre.getFecha_inicio(),
                                                trimestre.getFecha_fin());

                                CitaApaDto citaApaDto = new CitaApaDto(
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
                                                new ArrayList<>(),
                                                articulo.getNombre_articulo(),
                                                articulo.getEditorial(),
                                                articulo.getNombre_capitulo(),
                                                articulo.getObservaciones_directores(),
                                                articulo.getObservaciones_gestion(),
                                                articulo.getIndice_miar(),
                                                articulo.getCompilado(),
                                                articulo.getFinanciamiento_prodep(),
                                                trimestreDto);

                                articulosMap.put(articuloId, citaApaDto);
                        }

                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[21]);
                        autorDto.setApellidoMaternoAutor((String) result[22]);
                        autorDto.setApellidoPaternoAutor((String) result[23]);
                        autorDto.setAutorUnsis((Boolean) result[24]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);

                        articulosMap.get(articuloId).getAutores().add(autorDto);
                }

                return new ArrayList<>(articulosMap.values());
        }

        public List<CitaApaDto> getAllCitasApaInstituto_TipoPublicacion(Long idInstituto, Long id_TipoPublicacion) {
                List<Object[]> results = articuloDao.findAllArticulosWithAutoresInstitutoTipoPublicacion(idInstituto,
                                id_TipoPublicacion);

                if (results.isEmpty()) {
                        throw new ResourceNotFoundException("No se encontraron artículos");
                }

                Map<Long, CitaApaDto> articulosMap = new HashMap<>();

                for (Object[] result : results) {
                        Long articuloId = (Long) result[0];

                        if (!articulosMap.containsKey(articuloId)) {
                                Articulos articulo = new Articulos();
                                articulo.setId_articulo(articuloId);
                                articulo.setCompilado((Boolean) result[1]);
                                articulo.setDoi((String) result[2]);
                                articulo.setEditorial((String) result[3]);
                                articulo.setFecha_publicacion((Date) result[4]);
                                articulo.setFinanciamiento_prodep((Boolean) result[5]);
                                articulo.setIndice_miar((String) result[6]);
                                articulo.setIsbn_digital((String) result[7]);
                                articulo.setIsbn_impreso((String) result[8]);
                                articulo.setNombre_articulo((String) result[9]);
                                articulo.setNombre_capitulo((String) result[10]);
                                articulo.setNumero_revista((Integer) result[11]);
                                articulo.setObservaciones_directores((String) result[12]);
                                articulo.setObservaciones_gestion((String) result[13]);
                                articulo.setPag_final((Integer) result[14]);
                                articulo.setPag_inicio((Integer) result[15]);
                                articulo.setTitulo_revista((String) result[16]);
                                articulo.setVolumen_revista((String) result[17]);

                                Long idInstitutoResult = (Long) result[18];
                                Long idTipoPublicacion = (Long) result[19];
                                Long idTrimestre = (Long) result[20];

                                Instituto instituto = institutoDao.findById(idInstitutoResult)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Instituto no encontrado"));
                                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tipo de publicación no encontrado"));
                                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Trimestre no encontrado"));

                                articulo.setInstituto(instituto);
                                articulo.setTipo_Publicacion(tipoPublicacion);

                                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                                tipoPublicacion.getId_publicacion_tipo(),
                                                tipoPublicacion.getDescripcion_publicacion_tipo());

                                InstitutoDto institutoDto = new InstitutoDto(
                                                instituto.getId(),
                                                instituto.getNombre());

                                TrimestreDto trimestreDto = new TrimestreDto(
                                                trimestre.getId_trimestre(),
                                                trimestre.getNombre(),
                                                trimestre.getFecha_inicio(),
                                                trimestre.getFecha_fin());

                                CitaApaDto citaApaDto = new CitaApaDto(
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
                                                new ArrayList<>(),
                                                articulo.getNombre_articulo(),
                                                articulo.getEditorial(),
                                                articulo.getNombre_capitulo(),
                                                articulo.getObservaciones_directores(),
                                                articulo.getObservaciones_gestion(),
                                                articulo.getIndice_miar(),
                                                articulo.getCompilado(),
                                                articulo.getFinanciamiento_prodep(),
                                                trimestreDto);

                                articulosMap.put(articuloId, citaApaDto);
                        }

                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[21]);
                        autorDto.setApellidoMaternoAutor((String) result[22]);
                        autorDto.setApellidoPaternoAutor((String) result[23]);
                        autorDto.setAutorUnsis((Boolean) result[24]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);

                        articulosMap.get(articuloId).getAutores().add(autorDto);
                }

                return new ArrayList<>(articulosMap.values());
        }

        public List<CitaApaDto> getAllCitasApaInstituto_Investigador_TipoPublicacion(Long id_Instituto,
                        Long idInvestigador, Long id_TipoPublicacion) {
                List<Object[]> results = articuloDao.findAllArticulosWithAutoresInstitutoInvestigadorTipoPublicacion(
                                id_Instituto, idInvestigador, id_TipoPublicacion);

                if (results.isEmpty()) {
                        throw new ResourceNotFoundException("No se encontraron artículos");
                }

                Map<Long, CitaApaDto> articulosMap = new HashMap<>();

                for (Object[] result : results) {
                        Long articuloId = (Long) result[0];

                        if (!articulosMap.containsKey(articuloId)) {
                                Articulos articulo = new Articulos();
                                articulo.setId_articulo(articuloId);
                                articulo.setCompilado((Boolean) result[1]);
                                articulo.setDoi((String) result[2]);
                                articulo.setEditorial((String) result[3]);
                                articulo.setFecha_publicacion((Date) result[4]);
                                articulo.setFinanciamiento_prodep((Boolean) result[5]);
                                articulo.setIndice_miar((String) result[6]);
                                articulo.setIsbn_digital((String) result[7]);
                                articulo.setIsbn_impreso((String) result[8]);
                                articulo.setNombre_articulo((String) result[9]);
                                articulo.setNombre_capitulo((String) result[10]);
                                articulo.setNumero_revista((Integer) result[11]);
                                articulo.setObservaciones_directores((String) result[12]);
                                articulo.setObservaciones_gestion((String) result[13]);
                                articulo.setPag_final((Integer) result[14]);
                                articulo.setPag_inicio((Integer) result[15]);
                                articulo.setTitulo_revista((String) result[16]);
                                articulo.setVolumen_revista((String) result[17]);

                                Long idInstitutoResult = (Long) result[18];
                                Long idTipoPublicacion = (Long) result[19];
                                Long idTrimestre = (Long) result[20];

                                Instituto instituto = institutoDao.findById(idInstitutoResult)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Instituto no encontrado"));
                                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tipo de publicación no encontrado"));
                                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Trimestre no encontrado"));

                                articulo.setInstituto(instituto);
                                articulo.setTipo_Publicacion(tipoPublicacion);

                                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                                tipoPublicacion.getId_publicacion_tipo(),
                                                tipoPublicacion.getDescripcion_publicacion_tipo());

                                InstitutoDto institutoDto = new InstitutoDto(
                                                instituto.getId(),
                                                instituto.getNombre());

                                TrimestreDto trimestreDto = new TrimestreDto(
                                                trimestre.getId_trimestre(),
                                                trimestre.getNombre(),
                                                trimestre.getFecha_inicio(),
                                                trimestre.getFecha_fin());

                                CitaApaDto citaApaDto = new CitaApaDto(
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
                                                new ArrayList<>(),
                                                articulo.getNombre_articulo(),
                                                articulo.getEditorial(),
                                                articulo.getNombre_capitulo(),
                                                articulo.getObservaciones_directores(),
                                                articulo.getObservaciones_gestion(),
                                                articulo.getIndice_miar(),
                                                articulo.getCompilado(),
                                                articulo.getFinanciamiento_prodep(),
                                                trimestreDto);

                                articulosMap.put(articuloId, citaApaDto);
                        }

                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[21]);
                        autorDto.setApellidoMaternoAutor((String) result[22]);
                        autorDto.setApellidoPaternoAutor((String) result[23]);
                        autorDto.setAutorUnsis((Boolean) result[24]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);

                        articulosMap.get(articuloId).getAutores().add(autorDto);
                }

                return new ArrayList<>(articulosMap.values());
        }

        public List<CitaApaDto> getAllCitasApaProfesor(Long id_autor) {
                List<Object[]> results = articuloDao.findAllArticulosWithAutoresByAutorId(
                                id_autor);

                if (results.isEmpty()) {
                        throw new ResourceNotFoundException("No se encontraron artículos");
                }

                Map<Long, CitaApaDto> articulosMap = new HashMap<>();

                for (Object[] result : results) {
                        Long articuloId = (Long) result[0];

                        if (!articulosMap.containsKey(articuloId)) {
                                Articulos articulo = new Articulos();
                                articulo.setId_articulo(articuloId);
                                articulo.setCompilado((Boolean) result[1]);
                                articulo.setDoi((String) result[2]);
                                articulo.setEditorial((String) result[3]);
                                articulo.setFecha_publicacion((Date) result[4]);
                                articulo.setFinanciamiento_prodep((Boolean) result[5]);
                                articulo.setIndice_miar((String) result[6]);
                                articulo.setIsbn_digital((String) result[7]);
                                articulo.setIsbn_impreso((String) result[8]);
                                articulo.setNombre_articulo((String) result[9]);
                                articulo.setNombre_capitulo((String) result[10]);
                                articulo.setNumero_revista((Integer) result[11]);
                                articulo.setObservaciones_directores((String) result[12]);
                                articulo.setObservaciones_gestion((String) result[13]);
                                articulo.setPag_final((Integer) result[14]);
                                articulo.setPag_inicio((Integer) result[15]);
                                articulo.setTitulo_revista((String) result[16]);
                                articulo.setVolumen_revista((String) result[17]);

                                Long idInstitutoResult = (Long) result[18];
                                Long idTipoPublicacion = (Long) result[19];
                                Long idTrimestre = (Long) result[20];

                                Instituto instituto = institutoDao.findById(idInstitutoResult)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Instituto no encontrado"));
                                Tipo_Publicacion tipoPublicacion = tipoPublicacionDao.findById(idTipoPublicacion)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tipo de publicación no encontrado"));
                                Trimestre trimestre = trimestreDao.findById(idTrimestre)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Trimestre no encontrado"));

                                articulo.setInstituto(instituto);
                                articulo.setTipo_Publicacion(tipoPublicacion);

                                Tipo_PublicacionDto tipoPublicacionDto = new Tipo_PublicacionDto(
                                                tipoPublicacion.getId_publicacion_tipo(),
                                                tipoPublicacion.getDescripcion_publicacion_tipo());

                                InstitutoDto institutoDto = new InstitutoDto(
                                                instituto.getId(),
                                                instituto.getNombre());

                                TrimestreDto trimestreDto = new TrimestreDto(
                                                trimestre.getId_trimestre(),
                                                trimestre.getNombre(),
                                                trimestre.getFecha_inicio(),
                                                trimestre.getFecha_fin());

                                CitaApaDto citaApaDto = new CitaApaDto(
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
                                                new ArrayList<>(),
                                                articulo.getNombre_articulo(),
                                                articulo.getEditorial(),
                                                articulo.getNombre_capitulo(),
                                                articulo.getObservaciones_directores(),
                                                articulo.getObservaciones_gestion(),
                                                articulo.getIndice_miar(),
                                                articulo.getCompilado(),
                                                articulo.getFinanciamiento_prodep(),
                                                trimestreDto);

                                articulosMap.put(articuloId, citaApaDto);
                        }

                        AutorDto autorDto = new AutorDto();
                        autorDto.setId_autor((Long) result[21]);
                        autorDto.setApellidoMaternoAutor((String) result[22]);
                        autorDto.setApellidoPaternoAutor((String) result[23]);
                        autorDto.setAutorUnsis((Boolean) result[24]);
                        autorDto.setNombre1Autor((String) result[25]);
                        autorDto.setNombre2Autor((String) result[26]);

                        articulosMap.get(articuloId).getAutores().add(autorDto);
                }

                return new ArrayList<>(articulosMap.values());
        }

        @Override
        public List<Object[]> findFilteredArticulos(Long institutoId, Long autorId, String fechaInicio, String fechaFin, Integer tipo) {
            return articuloDao.findFilteredArticulos(institutoId, autorId, fechaInicio, fechaFin, tipo);
        }
}