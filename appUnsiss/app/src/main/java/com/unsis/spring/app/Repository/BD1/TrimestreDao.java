package com.unsis.spring.app.Repository.BD1;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unsis.spring.app.Entity.BD1.Trimestre;

public interface TrimestreDao extends JpaRepository<Trimestre, Long>{
    Optional<Trimestre> findByNombre(String nombre);
}
