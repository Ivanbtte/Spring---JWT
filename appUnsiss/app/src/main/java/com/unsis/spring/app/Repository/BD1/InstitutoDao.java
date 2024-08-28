package com.unsis.spring.app.Repository.BD1;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.unsis.spring.app.Entity.BD1.Instituto;


public interface InstitutoDao extends JpaRepository<Instituto, Long>{
    Optional<Instituto> findByNombre(String nombre);
}
