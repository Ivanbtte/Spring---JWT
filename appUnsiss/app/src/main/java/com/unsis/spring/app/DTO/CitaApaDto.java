package com.unsis.spring.app.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaApaDto {
    private Long idArticulo;
    private String tipoPublicacion;
    private String instituto;
    private Date fechaPublicacion;
    private String tituloRevista;
    private Integer numeroRevista;
    private String volumenRevista;
    private Integer pagInicio;
    private Integer pagFinal;
    private String doi;
    private String isbnImpreso;
    private String isbnDigital;
    private List<AutorDto> autores;
}
