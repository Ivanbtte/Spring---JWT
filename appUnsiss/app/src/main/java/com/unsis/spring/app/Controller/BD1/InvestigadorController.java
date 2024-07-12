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

import com.unsis.spring.app.Entity.BD1.Investigador;
import com.unsis.spring.app.Service.BD1.InvestigadorService;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
@RequestMapping("/api/v1") 	
public class InvestigadorController {

    @Autowired
	private InvestigadorService investigadorService;

    @GetMapping(value="/investigador")
	public ResponseEntity<Object> get(){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<Investigador> list  = investigadorService.findAll();
			return new ResponseEntity<Object>(list,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @GetMapping(value="/investigador/{id}")
     public ResponseEntity<Object> getById(@PathVariable Long id){ 
         try {
			Investigador data  = investigadorService.findById(id);
             return new ResponseEntity<Object>(data,HttpStatus.OK);
         } 
         catch (Exception e) {
             Map<String, Object> map = new HashMap<String, Object>();
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @PostMapping(value="/investigador")
	public ResponseEntity<Object> create(@RequestBody Investigador investigador){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			Investigador res = investigadorService.save(investigador);  
			return new ResponseEntity<Object>(res,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @PutMapping("/investigador/{id}")
     public ResponseEntity<Object> update(@RequestBody Investigador investigador, @PathVariable Long id){ 
         Map<String, Object> map = new HashMap<String, Object>();
         try {
             
			Investigador currentrInvestigador = investigadorService.findById(id);
             
            currentrInvestigador.setNum_empleado(investigador.getNum_empleado());
			currentrInvestigador.setNombre_1_investigador(investigador.getNombre_1_investigador());
			currentrInvestigador.setNombre_2_investigador(investigador.getNombre_2_investigador());
			currentrInvestigador.setApellido_paterno_1_investigador(investigador.getApellido_paterno_1_investigador());
			currentrInvestigador.setApellido_materno_2_investigador(investigador.getApellido_materno_2_investigador());
			currentrInvestigador.setUser(investigador.getUser());
			currentrInvestigador.setInstituto(investigador.getInstituto());
			currentrInvestigador.setAutor(investigador.getAutor());

			Investigador updatedInvestigador = investigadorService.save(currentrInvestigador);
             
            return new ResponseEntity<Object>(updatedInvestigador,HttpStatus.OK);
         } 
         catch (Exception e) {
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @DeleteMapping("/investigador/{id}")
	public ResponseEntity<Object> delete(@PathVariable Long id){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try { 
			Investigador currentrInvestigador = investigadorService.findById(id); 
			investigadorService.delete(currentrInvestigador);
			map.put("deleted", true);
			return new ResponseEntity<Object>(map,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}
}