package com.unsis.spring.app.Entity.BD1;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;  

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="trimestre")
public class Trimestre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_trimestre;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Date fecha_inicio;

    @Column(nullable = false)
    private Date fecha_fin;

}
