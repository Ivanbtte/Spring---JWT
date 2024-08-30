package com.unsis.spring.app.Repository.BD1;

import java.util.Date;
import java.util.Optional;
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

        // Esta consulta es la mera mera
        @Query(value = "SELECT " +
                        "a.id_articulo, "+
                        "a.compilado, " +
                        "a.doi, " +
                        "a.editorial, " +
                        "a.fecha_publicacion, " +
                        "a.financiamiento_prodep, " +
                        "a.indice_miar, " +
                        "a.isbn_digital, " +
                        "a.isbn_impreso, " +
                        "a.nombre_articulo, " +
                        "a.nombre_capitulo, " +
                        "a.numero_revista, " +
                        "a.observaciones_directores, " +
                        "a.observaciones_gestion, " +
                        "a.pag_final, " +
                        "a.pag_inicio, " +
                        "a.titulo_revista, " +
                        "a.volumen_revista, " +
                        "a.id_instituto, " +
                        "a.id_publicacion_tipo, " +
                        "a.id_trimestre, " +
                        "au.id_autor, " +
                        "au.apellido_materno_autor, " +
                        "au.apellido_paterno_autor, " +
                        "au.autor_unsis, " +
                        "au.nombre_1_autor, " +
                        "au.nombre_2_autor, " +
                        "a.aceptado_director, " +
                        "a.aceptado_gestion, " +
                        "a.file_metadata_id " +
                        "FROM Articulos a " +
                        "LEFT JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "LEFT JOIN public.investigador inv ON inv.id_autor = aa.id_autor " +
                        "LEFT JOIN autores au ON au.id_autor = aa.id_autor "+
                        "LEFT JOIN public.instituto i ON i.id = inv.id_instituto " +
                        "WHERE (:institutoId IS NULL OR a.id_instituto = :institutoId) " +
                        "AND (:autorId IS NULL OR aa.id_autor = :autorId) " +
                        "AND (:fechaInicio IS NULL OR a.fecha_publicacion >= CAST(:fechaInicio AS date)) " +
                        "AND (:fechaFin IS NULL OR a.fecha_publicacion <= CAST(:fechaFin AS date)) " +
                        "AND (:tipo IS NULL OR a.id_publicacion_tipo = :tipo)", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresPerro(
                        @Param("institutoId") Long institutoId,
                        @Param("autorId") Long autorId,
                        @Param("fechaInicio") String fechaInicio,
                        @Param("fechaFin") String fechaFin,
                        @Param("tipo") Integer tipo);

        // Consulta general FUNCIONA
        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutores();

        // Consulta de cada instituto FUNCIONA
        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "WHERE a.id_instituto = :id", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstituto(@Param("id") Long id);

        // Consulta de instituto e investigador FUNCIONA
        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "WHERE a.id_articulo IN (" +
                        "    SELECT aa.id_articulo " +
                        "    FROM articulo_autor aa " +
                        "    WHERE a.id_instituto = :idInstituto " +
                        "    AND aa.id_autor = :idInvestigador " +
                        ")", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstitutoInvestigador(@Param("idInstituto") Long idInstituto,
                        @Param("idInvestigador") Long idInvestigador);

        // Consulta de instituto y tipo de publicacion FUNCIONA
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

        // Consulta de instituto, investigador y tipo de publicacion FUNCIONA
        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "JOIN tipo_publicacion tp ON a.id_publicacion_tipo = tp.id_publicacion_tipo " +
                        "WHERE a.id_articulo IN (" +
                        "    SELECT aa.id_articulo " +
                        "    FROM articulo_autor aa " +
                        "    WHERE a.id_instituto= :idInstituto " +
                        "    AND  aa.id_autor  = :idInvestigador " +
                        "    AND tp.id_publicacion_tipo = :id_TipoPublicacion " +
                        ")", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresInstitutoInvestigadorTipoPublicacion(
                        @Param("idInstituto") Long idInstituto,
                        @Param("idInvestigador") Long id_Investigador,
                        @Param("id_TipoPublicacion") Long id_TipoPublicacion);

        // Consulta de profesor FUNCIONA
        @Query(value = "SELECT a.*, au.* " +
                        "FROM Articulos a " +
                        "JOIN articulo_autor aa ON a.id_articulo = aa.id_articulo " +
                        "JOIN autores au ON aa.id_autor = au.id_autor " +
                        "WHERE a.id_articulo IN (" +
                        "    SELECT aa.id_articulo " +
                        "    FROM articulo_autor aa " +
                        "    WHERE aa.id_autor = :id" +
                        ")", nativeQuery = true)
        List<Object[]> findAllArticulosWithAutoresByAutorId(@Param("id") Long id);

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
                        "a.volumen_revista, " +
                        "a.aceptado_director, " +
                        "a.aceptado_gestion, " +
                        "a.file_metadata_id " +
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
                        @Param("fechaFin") String fechaFin,
                        @Param("tipo") Integer tipo);

        // Reemplaza el método original con este
        @Query("SELECT a FROM Articulos a WHERE a.fecha_publicacion = :fechaPublicacion AND LOWER(a.nombre_articulo) = LOWER(:nombreArticulo)")
        Optional<Articulos> findByFechaPublicacionAndNombreArticulo(@Param("fechaPublicacion") Date fechaPublicacion,
                        @Param("nombreArticulo") String nombreArticulo);
}
