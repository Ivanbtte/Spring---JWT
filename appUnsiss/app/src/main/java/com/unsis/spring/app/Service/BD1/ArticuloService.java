package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.DTO.ArticuloDto;
import com.unsis.spring.app.DTO.CitaApaDto;
import com.unsis.spring.app.Entity.BD1.Articulos;

public interface ArticuloService {
    public List<ArticuloDto> findAll();

    public ArticuloDto save(ArticuloDto articuloDto);

    public ArticuloDto update(ArticuloDto articuloDto);

    public Articulos saveArticulo(Articulos articulo);

    public ArticuloDto findById(Long id);

    public Articulos findByIdArticulo(Long id);

    public void delete(Long id);

    public List<Articulos> findArticulosByAutorId(Long autorId);

    public ArticuloDto convertToDto(Articulos articulo);

    public Articulos convertToEntity(ArticuloDto articuloDto);

    public CitaApaDto getCitaApaById(Long id);

    public List<CitaApaDto> getAllCitasApa(Long institutoId, Long autorId, String fechaInicio, String fechaFin, Integer tipo);

    public List<CitaApaDto> getAllCitasApaInstituto(Long id);

    public List<CitaApaDto> getAllCitasApaInstituto_Investigador(Long idInstituto, Long idInvestigador);

    public List<CitaApaDto> getAllCitasApaInstituto_TipoPublicacion(Long idInstituto, Long id_TipoPublicacion);

    public List<CitaApaDto> getAllCitasApaInstituto_Investigador_TipoPublicacion(Long idInstituto, Long idInvestigador, Long id_TipoPublicacion);

    public List<CitaApaDto> getAllCitasApaProfesor(Long id);

    List<Object[]> findFilteredArticulos(Long institutoId, Long autorId, String fechaInicio, String fechaFin, Integer tipo);

}