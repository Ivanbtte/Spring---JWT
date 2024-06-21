package com.unsis.spring.app.Controller.BD1;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.unsis.spring.app.Entity.BD1.Tipo_Publicacion;
import com.unsis.spring.app.Service.BD1.Tipo_PublicacionService;

@RestController
@RequestMapping("/api/v1")
public class Tipo_PublicacionController {
    @Autowired
	private Tipo_PublicacionService tipo_PublicacionService;

    @GetMapping(value="/tipo_Publicacion")
	public ResponseEntity<Object> get(){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<Tipo_Publicacion> list  = tipo_PublicacionService.findAll();
			return new ResponseEntity<Object>(list,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @GetMapping(value="/tipo_Publicacion/{id}")
     public ResponseEntity<Object> getById(@PathVariable Long id){ 
         try {
            Tipo_Publicacion data  = tipo_PublicacionService.findById(id);
             return new ResponseEntity<Object>(data,HttpStatus.OK);
         } 
         catch (Exception e) {
             Map<String, Object> map = new HashMap<String, Object>();
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @PostMapping(value="/tipo_Publicacion")
	public ResponseEntity<Object> create(@RequestBody Tipo_Publicacion tipo_Publicacion){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			Tipo_Publicacion res = tipo_PublicacionService.save(tipo_Publicacion);  
			return new ResponseEntity<Object>(res,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @PutMapping("/tipo_Publicacion/{id}")
     public ResponseEntity<Object> update(@RequestBody Tipo_Publicacion tipo_Publicacion, @PathVariable Long id){ 
         Map<String, Object> map = new HashMap<String, Object>();
         try {
             
			Tipo_Publicacion currentrTipo_Publicacion = tipo_PublicacionService.findById(id);
             
            currentrTipo_Publicacion.setDescripcion_publicacion_tipo(tipo_Publicacion.getDescripcion_publicacion_tipo());
             
			Tipo_Publicacion updatedTipo_Publicacion = tipo_PublicacionService.save(currentrTipo_Publicacion);
             
            return new ResponseEntity<Object>(updatedTipo_Publicacion,HttpStatus.OK);
         } 
         catch (Exception e) {
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @DeleteMapping("/tipo_Publicacion/{id}")
	public ResponseEntity<Object> delete(@PathVariable Long id){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try { 
			Tipo_Publicacion currentrTipo_Publicacion = tipo_PublicacionService.findById(id); 
			tipo_PublicacionService.delete(currentrTipo_Publicacion);
			map.put("deleted", true);
			return new ResponseEntity<Object>(map,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}
}
