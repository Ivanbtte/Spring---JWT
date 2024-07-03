package com.unsis.spring.app.Repository.BD1;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.unsis.spring.app.Entity.BD1.Articulos;

public interface ArticuloDao extends JpaRepository<Articulos, Long>{

    @Query(value = "SELECT * FROM vw_articulos_con_autores WHERE id_autor = :autorId", nativeQuery = true)
    List<Articulos> findArticulosByAutorId(@Param("autorId") Long autorId);
} 

