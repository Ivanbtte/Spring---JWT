package com.unsis.spring.app.Repository.BD1;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.unsis.spring.app.Entity.BD1.Autor;

public interface AutorDao extends JpaRepository<Autor, Long> {

    @Query(value = "SELECT au.id_autor, " +
            "au.nombre_1_autor, " +
            "au.nombre_2_autor, " +
            "au.apellido_paterno_autor, " +
            "au.apellido_materno_autor, " +
            "au.autor_unsis " +
            "FROM autores au " +
            "JOIN articulo_autor aa ON au.id_autor = aa.id_autor " +
            "JOIN articulos ar ON aa.id_articulo = ar.id_articulo " +
            "WHERE ar.id_articulo = :id_articulo", nativeQuery = true)
    List<Object[]> findAutoresByArticuloId(@Param("id_articulo") Long idArticulo);

    @Modifying
    @Query(value = "DELETE FROM articulo_autor WHERE id_autor = :id_autor AND id_articulo = :id_articulo", nativeQuery = true)
    void deleteAutorArticuloRelation(@Param("id_autor") Long idAutor, @Param("id_articulo") Long idArticulo);

    @Modifying
    @Query(value = "DELETE FROM autores WHERE id_autor = :id_autor AND autor_unsis = FALSE", nativeQuery = true)
    void deleteAutorIfNotUnsis(@Param("id_autor") Long idAutor);
}