package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.io.InputStream;

import com.unsis.spring.app.DTO.InvestigadorDto;

public interface InvestigadorService {

    public List<InvestigadorDto> findAll();

    public InvestigadorDto save(InvestigadorDto investigadorDto);

    public InvestigadorDto findById(Long id);

    public InvestigadorDto findByIdUser(Long id);

    public void delete(Long id);

    public List<InvestigadorDto> findByInstitutoId(Long institutoId); // Nuevo método
    
    public List<InvestigadorDto> findInvestigadoresHabilitados();

    public List<InvestigadorDto> findInvestigadoresHabilitadosPorInstituto(Long institutoId);

    // Declaración del nuevo método
    public void cargarInvestigadoresDesdeExcel(InputStream excelInputStream) throws Exception;

}
