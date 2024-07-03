package com.unsis.spring.app.Controller.BD1;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unsis.spring.app.Entity.BD1.Articulos;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.Service.BD1.ArticuloService;
import com.unsis.spring.app.Service.BD1.AutorService;

@RestController
@RequestMapping("/api/v1")
public class ArticuloController {
    @Autowired
	private ArticuloService articuloService;

	@Autowired
    private AutorService autorService;

    @GetMapping(value="/articulo")
	public ResponseEntity<Object> get(){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<Articulos> list  = articuloService.findAll();
			return new ResponseEntity<Object>(list,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @GetMapping(value="/articulo/{id}")
     public ResponseEntity<Object> getById(@PathVariable Long id){ 
         try {
			Articulos data  = articuloService.findById(id);
             return new ResponseEntity<Object>(data,HttpStatus.OK);
         } 
         catch (Exception e) {
             Map<String, Object> map = new HashMap<String, Object>();
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @PostMapping(value="/articulo")
	public ResponseEntity<Object> create(@RequestBody Articulos articulo){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			Articulos res = articuloService.save(articulo);  
			return new ResponseEntity<Object>(res,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

    @PutMapping("/articulo/{id}")
    public ResponseEntity<Object> update(@RequestBody Articulos articulo, @PathVariable Long id){ 
        Map<String, Object> map = new HashMap<String, Object>();
        try {
             
			Articulos currentrArticulo = articuloService.findById(id);
             
            currentrArticulo.setFecha_publicacion(articulo.getFecha_publicacion());
			currentrArticulo.setTitulo_revista(articulo.getTitulo_revista());
			currentrArticulo.setNumero_revista(articulo.getNumero_revista());
			currentrArticulo.setVolumen_revista(articulo.getVolumen_revista());
			currentrArticulo.setPag_inicio(articulo.getPag_inicio());
            currentrArticulo.setPag_final(articulo.getPag_final());
            currentrArticulo.setDoi(articulo.getDoi());
            currentrArticulo.setIsbn_impreso(articulo.getIsbn_impreso());
            currentrArticulo.setIsbn_digital(articulo.getIsbn_digital());


			Articulos updatedInvestigador = articuloService.save(currentrArticulo);
             
            return new ResponseEntity<Object>(updatedInvestigador,HttpStatus.OK);
         } 
         catch (Exception e) {
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

    @DeleteMapping("/articulo/{id}")
	public ResponseEntity<Object> delete(@PathVariable Long id){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try { 
			Articulos currentrInvestigador = articuloService.findById(id); 
			articuloService.delete(currentrInvestigador);
			map.put("deleted", true);
			return new ResponseEntity<Object>(map,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

	@PostMapping("/articulo/{id}/autores/{autorId}")
    public ResponseEntity<Object> addAutorToArticulo(@PathVariable Long id, @PathVariable Long autorId) {
        Map<String, Object> map = new HashMap<>();
        try {
            Articulos articulo = articuloService.findById(id);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Autor autor = autorService.findById(autorId);
            if (autor == null) {
                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            articulo.getAutores().add(autor);
            Articulos updatedArticulo = articuloService.save(articulo);
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
            Articulos articulo = articuloService.findById(id);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Autor autor = autorService.findById(autorId);
            if (autor == null) {
                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            articulo.getAutores().remove(autor);
            Articulos updatedArticulo = articuloService.save(articulo);
            return new ResponseEntity<>(updatedArticulo, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value="/articulos/autor/{autorId}")
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
}
