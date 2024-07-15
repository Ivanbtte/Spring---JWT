package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.InvestigadorDto;

public interface InvestigadorService {

   public List<InvestigadorDto> findAll();
    public InvestigadorDto save(InvestigadorDto investigadorDto);
    public InvestigadorDto findById(Long id);
    public void delete(Long id);
    
}
