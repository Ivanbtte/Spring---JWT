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
public class AutorController {
    
    @Autowired
    private AutorService autorService;

    @Autowired
    private ArticuloService articuloService;

    @GetMapping(value="/autor")
	public ResponseEntity<Object> get(){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<Autor> list  = autorService.findAll();
			return new ResponseEntity<Object>(list,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @GetMapping(value="/autor/{id}")
     public ResponseEntity<Object> getById(@PathVariable Long id){ 
         try {
            Autor data  = autorService.findById(id);
             return new ResponseEntity<Object>(data,HttpStatus.OK);
         } 
         catch (Exception e) {
             Map<String, Object> map = new HashMap<String, Object>();
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @PostMapping(value="/autor")
	public ResponseEntity<Object> create(@RequestBody Autor autor){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			Autor res = autorService.save(autor);  
			return new ResponseEntity<Object>(res,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @PutMapping("/autor/{id}")
     public ResponseEntity<Object> update(@RequestBody Autor autor, @PathVariable Long id){ 
         Map<String, Object> map = new HashMap<String, Object>();
         try {
             
			Autor currentrAutor = autorService.findById(id);
             
            currentrAutor.setNombre1Autor(autor.getNombre1Autor());
            currentrAutor.setNombre2Autor(autor.getNombre2Autor());
            currentrAutor.setApellidoPaternoAutor(autor.getApellidoPaternoAutor());
            currentrAutor.setApellidoMaternoAutor(autor.getApellidoMaternoAutor());
            currentrAutor.setAutorUnsis(autor.getAutorUnsis());
             
			Autor updatedAutor = autorService.save(currentrAutor);
             
            return new ResponseEntity<Object>(updatedAutor,HttpStatus.OK);
         } 
         catch (Exception e) {
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @DeleteMapping("/autor/{id}")
	public ResponseEntity<Object> delete(@PathVariable Long id){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try { 
			Autor currentrAutor = autorService.findById(id); 
			autorService.delete(currentrAutor);
			map.put("deleted", true);
			return new ResponseEntity<Object>(map,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

	 @PostMapping("/autor/{id}/articulos/{articuloId}")
    public ResponseEntity<Object> addArticuloToAutor(@PathVariable Long id, @PathVariable Long articuloId) {
        Map<String, Object> map = new HashMap<>();
        try {
            Autor autor = autorService.findById(id);
            if (autor == null) {
                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Articulos articulo = articuloService.findById(articuloId);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            autor.getArticulos().add(articulo);
            Autor updatedAutor = autorService.save(autor);
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
            Autor autor = autorService.findById(id);
            if (autor == null) {
                map.put("message", "Autor no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            Articulos articulo = articuloService.findById(articuloId);
            if (articulo == null) {
                map.put("message", "Artículo no encontrado");
                return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
            }

            autor.getArticulos().remove(articulo);
            Autor updatedAutor = autorService.save(autor);
            return new ResponseEntity<>(updatedAutor, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
