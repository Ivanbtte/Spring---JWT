package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.InstitutoDto;
import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Repository.BD1.InstitutoDao;

import jakarta.transaction.Transactional;

@Service
public class InstitutoServiceImpl implements InstitutoService{
    
    @Autowired
	private InstitutoDao institutoDao;
	
	@Override
	@Transactional
	public List<InstitutoDto> findAll() {
        return institutoDao.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

	@Override
    @Transactional
    public InstitutoDto save(InstitutoDto institutoDto) {
        Instituto instituto = convertToEntity(institutoDto);
        Instituto savedInstituto = institutoDao.save(instituto);
        return convertToDto(savedInstituto);
    }

	@Override
    public InstitutoDto findById(Long id) {
        Instituto instituto = institutoDao.findById(id).orElse(null);
        return convertToDto(instituto);
    }

	@Override
    @Transactional
    public void delete(Long id) {
        institutoDao.deleteById(id);
    }

	private InstitutoDto convertToDto(Instituto instituto) {
        if (instituto == null) return null;
        return new InstitutoDto(instituto.getId(), instituto.getNombre());
    }

    private Instituto convertToEntity(InstitutoDto institutoDto) {
        return new Instituto(institutoDto.getId(), institutoDto.getNombre());
    }
    
}
