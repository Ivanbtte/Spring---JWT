package com.unsis.spring.app.Repository.BD1;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.unsis.spring.app.Entity.BD1.Articulos;

public interface ArticuloDao extends JpaRepository<Articulos, Long> {

    @Query(value = "SELECT * FROM vw_articulos_con_autores WHERE id_autor = :autorId", nativeQuery = true)
    List<Articulos> findArticulosByAutorId(@Param("autorId") Long autorId);

    @Query(value = "SELECT a.*, au.* " +
            "FROM articulos a " +
            "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
            "JOIN autores au ON aa.id_autor = au.id_autor " +
            "WHERE a.id_articulo = :id", nativeQuery = true)
    List<Object[]> findArticuloWithAutoresById(@Param("id") Long id);
    @Query("SELECT a, i, t, tri, au " +
           "FROM Articulos a " +
           "JOIN a.instituto i " +
           "JOIN a.tipo_Publicacion t " +
           "JOIN a.trimestre tri " +
           "JOIN a.autores au")
    List<Object[]> findAllArticulosWithAutores();

}
