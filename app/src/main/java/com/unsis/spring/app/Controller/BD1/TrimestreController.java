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

import com.unsis.spring.app.DTO.TrimestreDto;
import com.unsis.spring.app.Service.BD1.TrimestreService;

@RestController
@CrossOrigin(origins = { "http://192.168.3.20:8080" })
@RequestMapping("/api/v1")
public class TrimestreController {

    @Autowired
    private TrimestreService trimestreService;

    @GetMapping(value = "/trimestre")
    public ResponseEntity<Object> get() {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<TrimestreDto> list = trimestreService.findAll();
            return new ResponseEntity<Object>(list, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/trimestre/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        try {
            TrimestreDto data = trimestreService.findById(id);
            return new ResponseEntity<Object>(data, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/trimestre")
    public ResponseEntity<Object> create(@RequestBody TrimestreDto trimestreDto) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            TrimestreDto res = trimestreService.save(trimestreDto);
            return new ResponseEntity<Object>(res, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/trimestre/{id}")
    public ResponseEntity<Object> update(@RequestBody TrimestreDto trimestreDto, @PathVariable Long id) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {

            TrimestreDto currentrTrimestre = trimestreService.findById(id);

            currentrTrimestre.setNombre(trimestreDto.getNombre());
            currentrTrimestre.setFecha_inicio(trimestreDto.getFecha_inicio());
            currentrTrimestre.setFecha_fin(trimestreDto.getFecha_fin());
            
            TrimestreDto updatedTrimestre = trimestreService.save(currentrTrimestre);

            return new ResponseEntity<Object>(updatedTrimestre, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/trimestre/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<>();
        try {
            trimestreService.delete(id);
            map.put("deleted", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
