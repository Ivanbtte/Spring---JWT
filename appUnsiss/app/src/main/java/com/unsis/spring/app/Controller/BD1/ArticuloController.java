package com.unsis.spring.app.Controller.BD1;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.DocumentException;
import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.DTO.CitaApaDto;
import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.ReportPDF.ArticuloReportPDF;
import com.unsis.spring.app.ExceptionHandler.ResourceNotFoundException;
import com.unsis.spring.app.Service.BD1.ArticuloService;
import com.unsis.spring.app.Service.BD1.AutorService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1")
public class ArticuloController {
    @Autowired
    private ArticuloService articuloService;

    @Autowired
    private AutorService autorService;

    @GetMapping(value = "/articulo")
    public ResponseEntity<Object> get() {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<ArticuloDto> list = articuloService.findAll();
            return new ResponseEntity<Object>(list, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/articulo/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        try {
            ArticuloDto data = articuloService.findById(id);
            return new ResponseEntity<Object>(data, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/articulo")
    public ResponseEntity<Object> create(@RequestBody ArticuloDto articuloDto) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            ArticuloDto res = articuloService.save(articuloDto);
            return new ResponseEntity<Object>(res, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/articulo/{id}")
    public ResponseEntity<Object> update(@RequestBody ArticuloDto articuloDto, @PathVariable Long id) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            ArticuloDto currentArticulo = articuloService.findById(id);

            currentArticulo.setFecha_publicacion(articuloDto.getFecha_publicacion());
            currentArticulo.setTitulo_revista(articuloDto.getTitulo_revista());
            currentArticulo.setNumero_revista(articuloDto.getNumero_revista());
            currentArticulo.setVolumen_revista(articuloDto.getVolumen_revista());
            currentArticulo.setPag_inicio(articuloDto.getPag_inicio());
            currentArticulo.setPag_final(articuloDto.getPag_final());
            currentArticulo.setDoi(articuloDto.getDoi());
            currentArticulo.setIsbn_impreso(articuloDto.getIsbn_impreso());
            currentArticulo.setIsbn_digital(articuloDto.getIsbn_digital());
            currentArticulo.setTipoPublicacion(articuloDto.getTipoPublicacion());
            currentArticulo.setInstituto(articuloDto.getInstituto());
            currentArticulo.setNombre_articulo(articuloDto.getNombre_articulo());
            currentArticulo.setEditorial(articuloDto.getEditorial());
            currentArticulo.setNombre_capitulo(articuloDto.getNombre_capitulo());
            currentArticulo.setObservaciones_directores(articuloDto.getObservaciones_directores());
            currentArticulo.setObservaciones_gestion(articuloDto.getObservaciones_gestion());
            currentArticulo.setIndice_miar(articuloDto.getIndice_miar());
            currentArticulo.setCompilado(articuloDto.isCompilado());
            currentArticulo.setTrimestre(articuloDto.getTrimestre());
            currentArticulo.setFinanciamiento_prodep(articuloDto.isFinanciamiento_prodep());

            ArticuloDto updatedArticulo = articuloService.save(currentArticulo);

            return new ResponseEntity<>(updatedArticulo, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/articulo/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<>();
        try {
            articuloService.delete(id);
            map.put("deleted", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/articulo/{id}/autores/{autorId}")
    public ResponseEntity<Object> addAutorToArticulo(@PathVariable Long id, @PathVariable Long autorId) {
        Map<String, Object> map = new HashMap<>();
        try {
            Articulos articulo = articuloService.findByIdArticulo(id);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }
            Autor autor = autorService.findByIdAutor(autorId);
            if (autor == null) {

                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }
            articulo.getAutores().add(autor);
            Articulos updatedArticulo = articuloService.saveArticulo(articulo);
            return new ResponseEntity<>(updatedArticulo, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/articulo/{id}/autores/{autorId}")
    public ResponseEntity<Object> removeAutorFromArticulo(@PathVariable Long id, @PathVariable Long autorId) {
        Map<String, Object> map = new HashMap<>();
        try {
            Articulos articulo = articuloService.findByIdArticulo(id);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Autor autor = autorService.findByIdAutor(autorId);
            if (autor == null) {

                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            articulo.getAutores().remove(autor);
            Articulos updatedArticulo = articuloService.saveArticulo(articulo);
            return new ResponseEntity<>(updatedArticulo, HttpStatus.OK);

        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/articulos/autor/{autorId}")
    public ResponseEntity<Object> getArticulosByAutorId(@PathVariable Long autorId) {
        try {
            List<Articulos> data = articuloService.findArticulosByAutorId(autorId);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Nuevo endpoint para obtener CitaApaDto por ID
    @GetMapping(value = "/citaapa/{id}")
    public ResponseEntity<Object> getCitaApa(@PathVariable Long id) {
        try {
            CitaApaDto citaApa = articuloService.getCitaApaById(id);
            return new ResponseEntity<>(citaApa, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/user/exportarPDF")
    public void exportarPDFdeusuarios(HttpServletResponse response) throws DocumentException, IOException {
        response.setContentType("application/pdf");

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String fechaActual = dateFormatter.format(new Date());

        String cabecera = "Content-Disposition";
        String valor = "attachment; filename=Usuarios_" + fechaActual + ".pdf";

        response.setHeader(cabecera, valor);

        List<CitaApaDto> articulos = articuloService.getAllCitasApa();

        ArticuloReportPDF exporter = new ArticuloReportPDF(articulos);
        exporter.exportar(response);
    }
}
