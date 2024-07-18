package com.unsis.spring.app.DTO;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrimestreDto {
    
    private Long id_trimestre;
    private String nombre;
    private Date fecha_inicio;
    private Date fecha_fin;

}
