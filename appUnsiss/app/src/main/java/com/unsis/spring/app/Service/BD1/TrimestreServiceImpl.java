package com.unsis.spring.app.Service.BD1;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.TrimestreDto;
import com.unsis.spring.app.Entity.BD1.Trimestre;
import com.unsis.spring.app.Repository.BD1.TrimestreDao;

import jakarta.transaction.Transactional;

@Service
public class TrimestreServiceImpl implements TrimestreService {

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
        if (trimestre == null)
            return null;
        return new TrimestreDto(trimestre.getId_trimestre(), trimestre.getNombre(), trimestre.getFecha_inicio(),
                trimestre.getFecha_fin());
    }

    private Trimestre convertToEntity(TrimestreDto trimestreDto) {
        return new Trimestre(trimestreDto.getId_trimestre(), trimestreDto.getNombre(), trimestreDto.getFecha_inicio(),
                trimestreDto.getFecha_fin());
    }

    // Nuevo método para generar trimestre automáticamente
    public void generarTrimestreSiEsNecesario() {
        YearMonth ahora = YearMonth.now();
        int mes = ahora.getMonthValue();
        int año = ahora.getYear();
        String nombreTrimestre;

        if (mes >= 1 && mes <= 3) {
            nombreTrimestre = "T1 - " + año;
        } else if (mes >= 4 && mes <= 6) {
            nombreTrimestre = "T2 - " + año;
        } else if (mes >= 7 && mes <= 9) {
            nombreTrimestre = "T3 - " + año;
        } else {
            nombreTrimestre = "T4 - " + año;
        }

        Optional<Trimestre> trimestreExistente = trimestreDao.findByNombre(nombreTrimestre);

        if (trimestreExistente.isEmpty()) {
            Trimestre nuevoTrimestre = new Trimestre();
            nuevoTrimestre.setNombre(nombreTrimestre);
            nuevoTrimestre.setFecha_inicio(convertToDate(ahora.atDay(1)));
            nuevoTrimestre.setFecha_fin(calcularFechaFinTrimestre(ahora));

            trimestreDao.save(nuevoTrimestre);
        }
    }

    private Date convertToDate(LocalDate localDate) {
        return java.sql.Date.valueOf(localDate);
    }

    private Date calcularFechaFinTrimestre(YearMonth inicioTrimestre) {
        YearMonth finTrimestre = inicioTrimestre.plusMonths(2);
        return convertToDate(finTrimestre.atEndOfMonth());
    }
}
