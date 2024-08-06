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

}
