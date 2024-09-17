package com.unsis.spring.app.Controller.BD1;

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

import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.Entity.BD1.Articulo_Autor;
import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.Service.BD1.ArticuloService;
import com.unsis.spring.app.Service.BD1.AutorService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1")
public class AutorController {

    @Autowired
    private AutorService autorService;

    @Autowired
    private ArticuloService articuloService;

    @GetMapping(value = "/autor")
    public ResponseEntity<Object> get() {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<AutorDto> list = autorService.findAll();
            return new ResponseEntity<Object>(list, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/autor/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        try {
            AutorDto data = autorService.findById(id);
            return new ResponseEntity<Object>(data, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/autor")
    public ResponseEntity<Object> create(@RequestBody AutorDto autorDto) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            AutorDto res = autorService.save(autorDto);
            return new ResponseEntity<Object>(res, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/autor/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody AutorDto autorDto) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {

            AutorDto currentrAutor = autorService.findById(id);

            currentrAutor.setNombre1Autor(autorDto.getNombre1Autor());
            currentrAutor.setNombre2Autor(autorDto.getNombre2Autor());
            currentrAutor.setApellidoPaternoAutor(autorDto.getApellidoPaternoAutor());
            currentrAutor.setApellidoMaternoAutor(autorDto.getApellidoMaternoAutor());
            currentrAutor.setAutorUnsis(autorDto.getAutorUnsis());

            AutorDto updatedAutor = autorService.save(currentrAutor);

            return new ResponseEntity<Object>(updatedAutor, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autor/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<>();
        try {
            autorService.delete(id);
            map.put("deleted", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autor-unsis/{idAutor}/articulo/{idArticulo}")
    public ResponseEntity<Object> deleteAutorUnsisArticuloRelation(
            @PathVariable Long idAutor,
            @PathVariable Long idArticulo) {
        Map<String, Object> map = new HashMap<>();
        try {
            // Llama al servicio para eliminar la relación entre autor UNSIS y artículo
            autorService.deleteAutorArticuloRelation(idAutor, idArticulo);
            map.put("deleted", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autor-no-unsis/{idAutor}/articulo/{idArticulo}")
    public ResponseEntity<Object> deleteAutorNoUnsisArticuloRelation(
            @PathVariable Long idAutor,
            @PathVariable Long idArticulo) {
        Map<String, Object> map = new HashMap<>();
        try {
            // Llama al servicio para eliminar la relación entre autor no UNSIS y artículo
            autorService.deleteAutorNoArticuloRelation(idAutor, idArticulo);
            map.put("deleted", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/autor/{id}/articulos/{articuloId}")
    public ResponseEntity<Object> addArticuloToAutor(@PathVariable Long id, @PathVariable Long articuloId,
            @RequestBody String rolAutor) {
        Map<String, Object> map = new HashMap<>();
        try {
            Autor autor = autorService.findByIdAutor(id);
            if (autor == null) {
                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Articulos articulo = articuloService.findByIdArticulo(articuloId);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            // Crear nueva instancia de Articulo_Autor
            Articulo_Autor articuloAutor = new Articulo_Autor();
            articuloAutor.setArticulo(articulo);
            articuloAutor.setAutor(autor);
            articuloAutor.setRol_autor(rolAutor);

            // Añadir a las colecciones
            autor.getArticulosAutores().add(articuloAutor);
            articulo.getAutoresArticulos().add(articuloAutor);

            // Guardar cambios
            Autor updatedAutor = autorService.saveAutor(autor);
            return new ResponseEntity<>(updatedAutor, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autor/{id}/articulos/{articuloId}")
    public ResponseEntity<Object> removeArticuloFromAutor(@PathVariable Long id, @PathVariable Long articuloId) {
        Map<String, Object> map = new HashMap<>();
        try {
            Autor autor = autorService.findByIdAutor(id);
            if (autor == null) {
                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Articulos articulo = articuloService.findByIdArticulo(articuloId);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            // Buscar la relación correspondiente en Articulo_Autor
            Articulo_Autor articuloAutor = autor.getArticulosAutores().stream()
                    .filter(aa -> aa.getArticulo().getId_articulo().equals(articuloId))
                    .findFirst()
                    .orElse(null);

            if (articuloAutor == null) {
                map.put("message", "Relación Artículo-Autor no encontrada");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            // Eliminar de las colecciones
            autor.getArticulosAutores().remove(articuloAutor);
            articulo.getAutoresArticulos().remove(articuloAutor);

            // Guardar cambios
            Autor updatedAutor = autorService.saveAutor(autor);
            return new ResponseEntity<>(updatedAutor, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/autor/{idArticulo}/autores")
    public ResponseEntity<Object> getAutoresByArticuloId(@PathVariable Long idArticulo) {
        Map<String, Object> map = new HashMap<>();
        try {
            // Llama al servicio para obtener la lista de autores
            List<AutorDto> list = autorService.findAllArt(idArticulo);
            // Devuelve la lista en una ResponseEntity con estado OK
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            // Devuelve un mapa con el mensaje de error y estado INTERNAL_SERVER_ERROR
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
