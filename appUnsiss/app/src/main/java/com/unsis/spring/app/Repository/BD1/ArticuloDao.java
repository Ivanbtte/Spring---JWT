package com.unsis.spring.app.Repository.BD1;

import java.util.Date;
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

        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutores();

        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "WHERE a.id_instituto = :id", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstituto(@Param("id") Long id);

        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "WHERE a.id_instituto = :idInstituto " +
                        "AND au.id_autor = :idInvestigador", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstitutoInvestigador(@Param("idInstituto") Long idInstituto,
                        @Param("idInvestigador") Long idInvestigador);

        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "JOIN tipo_publicacion tp ON a.id_publicacion_tipo = tp.id_publicacion_tipo " +
                        "WHERE a.id_instituto = :idInstituto " +
                        "AND tp.id_publicacion_tipo = :id_TipoPublicacion", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstitutoTipoPublicacion(
                        @Param("idInstituto") Long idInstituto,
                        @Param("id_TipoPublicacion") Long id_TipoPublicacion);

        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "JOIN tipo_publicacion tp ON a.id_publicacion_tipo = tp.id_publicacion_tipo " +
                        "WHERE a.id_instituto = :idInstituto " +
                        "AND au.id_autor = :idInvestigador " +
                        "AND tp.id_publicacion_tipo = :id_TipoPublicacion", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstitutoInvestigadorTipoPublicacion(
                        @Param("idInstituto") Long idInstituto,
                        @Param("idInvestigador") Long id_Investigador,
                        @Param("id_TipoPublicacion") Long id_TipoPublicacion);

        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_Autor " +
                        "WHERE au.id_autor = :id_Autor", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresByProfesor(
                        @Param("id_Autor") Long id_Autor);

        @Query(value = "SELECT DISTINCT " +
                        "a.compilado, " +
                        "a.financiamiento_prodep, " +
                        "a.numero_revista, " +
                        "a.pag_final, " +
                        "a.pag_inicio, " +
                        "a.fecha_publicacion, " +
                        "a.id_articulo, " +
                        "a.id_instituto, " +
                        "a.id_publicacion_tipo, " +
                        "a.id_trimestre, " +
                        "a.doi, " +
                        "a.editorial, " +
                        "a.indice_miar, " +
                        "a.isbn_digital, " +
                        "a.isbn_impreso, " +
                        "a.nombre_articulo, " +
                        "a.nombre_capitulo, " +
                        "a.observaciones_directores, " +
                        "a.observaciones_gestion, " +
                        "a.titulo_revista, " +
                        "a.volumen_revista " +
                        "FROM Articulos a " +
                        "LEFT JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "LEFT JOIN public.investigador inv ON inv.id_autor = aa.id_autor " +
                        "LEFT JOIN public.instituto i ON i.id = inv.id_instituto " +
                        "WHERE (:institutoId IS NULL OR a.id_instituto = :institutoId) " +
                        "AND (:autorId IS NULL OR aa.id_autor = :autorId) " +
                        "AND (:fechaInicio IS NULL OR a.fecha_publicacion >= CAST(:fechaInicio AS date)) " +
                        "AND (:fechaFin IS NULL OR a.fecha_publicacion <= CAST(:fechaFin AS date)) " +
                        "AND (:tipo IS NULL OR a.id_publicacion_tipo = :tipo)", nativeQuery = true)
        List<Object[]> findFilteredArticulos(
                        @Param("institutoId") Long institutoId,
                        @Param("autorId") Long autorId,
                        @Param("fechaInicio") String fechaInicio,
                        @Param("fechaFin") String  fechaFin,
                        @Param("tipo") Integer tipo);
}
