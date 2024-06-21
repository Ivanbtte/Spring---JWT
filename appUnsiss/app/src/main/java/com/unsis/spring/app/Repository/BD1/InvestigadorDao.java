package com.unsis.spring.app.Repository.BD1;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unsis.spring.app.Entity.BD1.Investigador;

public interface InvestigadorDao extends JpaRepository<Investigador, Long> {
    
}
