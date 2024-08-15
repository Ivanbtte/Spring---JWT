package com.unsis.spring.app.Repository.BD1;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import com.unsis.spring.app.Entity.BD1.Investigador;
import com.unsis.spring.app.User.User;

public interface InvestigadorDao extends JpaRepository<Investigador, Long> {

    List<Investigador> findByInstitutoId(Long institutoId); // Nuevo método

    @Query(value = "SELECT i.* FROM investigador i JOIN usuario u ON i.id_usuario = u.id WHERE u.id = :userId", nativeQuery = true)
    List<Investigador> findByUser2(@Param("userId") Long userId);

    Optional<Investigador> findByUser(User user);
}
