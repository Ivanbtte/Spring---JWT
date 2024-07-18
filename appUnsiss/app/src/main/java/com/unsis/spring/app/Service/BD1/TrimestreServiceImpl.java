package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.TrimestreDto;
import com.unsis.spring.app.Entity.BD1.Trimestre;
import com.unsis.spring.app.Repository.BD1.TrimestreDao;

import jakarta.transaction.Transactional;

@Service
public class TrimestreServiceImpl implements TrimestreService{

    @Autowired
	private TrimestreDao trimestreDao;

    @Override
    @Transactional
    public List<TrimestreDto> findAll() {
        return trimestreDao.findAll().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TrimestreDto save(TrimestreDto trimestreDto) {
        Trimestre trimestre = convertToEntity(trimestreDto);
        Trimestre savedTrimestre = trimestreDao.save(trimestre);
        return convertToDto(savedTrimestre);
    }

    @Override
    public TrimestreDto findById(Long id) {
        Trimestre trimestre = trimestreDao.findById(id).orElse(null);
        return convertToDto(trimestre);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        trimestreDao.deleteById(id);
    }

    private TrimestreDto convertToDto(Trimestre trimestre) {
        if (trimestre == null) return null;
        return new TrimestreDto(trimestre.getId_trimestre(), trimestre.getNombre(), trimestre.getFecha_inicio(), trimestre.getFecha_fin());
    }

    private Trimestre convertToEntity(TrimestreDto trimestreDto) {
        return new Trimestre(trimestreDto.getId_trimestre(), trimestreDto.getNombre(), trimestreDto.getFecha_inicio(), trimestreDto.getFecha_fin());
    }
    
}
