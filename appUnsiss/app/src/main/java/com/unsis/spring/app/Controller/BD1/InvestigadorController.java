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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.DTO.InvestigadorDto;
import com.unsis.spring.app.Service.BD1.InvestigadorService;

@RestController
@CrossOrigin(origins = { "http://localhost:4200" })
@RequestMapping("/api/v1")
public class InvestigadorController {

    @Autowired
    private InvestigadorService investigadorService;

    @GetMapping(value = "/investigador")
    public ResponseEntity<Object> get() {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<InvestigadorDto> list = investigadorService.findInvestigadoresHabilitados();
            return new ResponseEntity<Object>(list, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/investigador/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        try {
            InvestigadorDto data = investigadorService.findById(id);
            return new ResponseEntity<Object>(data, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/investigadorUser/{id}")
    public ResponseEntity<Object> getByIdUser(@PathVariable Long id) {
        try {
            InvestigadorDto data = investigadorService.findByIdUser(id);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/investigador")
    public ResponseEntity<Object> create(@RequestBody InvestigadorDto investigadorDto) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            InvestigadorDto res = investigadorService.save(investigadorDto);
            return new ResponseEntity<Object>(res, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/investigador/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody InvestigadorDto investigadorDto) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            InvestigadorDto currentrInvestigador = investigadorService.findById(id);

            currentrInvestigador.setNum_empleado(investigadorDto.getNum_empleado());
            currentrInvestigador.setNombre_1_investigador(investigadorDto.getNombre_1_investigador());
            currentrInvestigador.setNombre_2_investigador(investigadorDto.getNombre_2_investigador());
            currentrInvestigador
                    .setApellido_paterno_1_investigador(investigadorDto.getApellido_paterno_1_investigador());
            currentrInvestigador
                    .setApellido_materno_2_investigador(investigadorDto.getApellido_materno_2_investigador());
            currentrInvestigador.setUser(investigadorDto.getUser());
            currentrInvestigador.setInstituto(investigadorDto.getInstituto());
            currentrInvestigador.setAutor(investigadorDto.getAutor());

            InvestigadorDto updatedInvestigador = investigadorService.save(currentrInvestigador);

            return new ResponseEntity<Object>(updatedInvestigador, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/investigador/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            investigadorService.delete(id);
            map.put("deleted", true);
            return new ResponseEntity<Object>(map, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/investigador/instituto/{institutoId}")
    public ResponseEntity<Object> getByInstitutoId(@PathVariable Long institutoId) {
        Map<String, Object> map = new HashMap<>();
        try {
            List<InvestigadorDto> investigadores = investigadorService.findInvestigadoresHabilitadosPorInstituto(institutoId);
            return new ResponseEntity<>(investigadores, HttpStatus.OK);
        } catch (Exception e) {
            map.put("message", e.getMessage());
            return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/investigador/cargar-excel")
    public ResponseEntity<String> cargarInvestigadoresDesdeExcel(@RequestParam("file") MultipartFile file) {
        try {
            investigadorService.cargarInvestigadoresDesdeExcel(file.getInputStream());
            return ResponseEntity.status(HttpStatus.OK).body("Archivo cargado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cargar el archivo: " + e.getMessage());
        }
    }
}