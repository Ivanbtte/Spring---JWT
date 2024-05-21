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

import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Service.BD1.InstitutoService;

@RestController
@RequestMapping("/api/v1")
public class InstitutoController {
    
    @Autowired
	private InstitutoService institutoService;

    @GetMapping(value="/instituto")
	public ResponseEntity<Object> get(){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<Instituto> list  = institutoService.findAll();
			return new ResponseEntity<Object>(list,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @GetMapping(value="/instituto/{id}")
     public ResponseEntity<Object> getById(@PathVariable Long id){ 
         try {
			 Instituto data  = institutoService.findById(id);
             return new ResponseEntity<Object>(data,HttpStatus.OK);
         } 
         catch (Exception e) {
             Map<String, Object> map = new HashMap<String, Object>();
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @PostMapping(value="/instituto")
	public ResponseEntity<Object> create(@RequestBody Instituto instituto){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			Instituto res = institutoService.save(instituto);  
			return new ResponseEntity<Object>(res,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @PutMapping("/instituto/{id}")
     public ResponseEntity<Object> update(@RequestBody Instituto instituto, @PathVariable Long id){ 
         Map<String, Object> map = new HashMap<String, Object>();
         try {
             
			Instituto currentrInstituto = institutoService.findById(id);
             
            currentrInstituto.setNombre(instituto.getNombre());
             
			Instituto updatedInstituto = institutoService.save(currentrInstituto);
             
            return new ResponseEntity<Object>(updatedInstituto,HttpStatus.OK);
         } 
         catch (Exception e) {
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @DeleteMapping("/instituto/{id}")
	public ResponseEntity<Object> delete(@PathVariable Long id){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try { 
			Instituto currentrInstituto = institutoService.findById(id); 
			institutoService.delete(currentrInstituto);
			map.put("deleted", true);
			return new ResponseEntity<Object>(map,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}
}