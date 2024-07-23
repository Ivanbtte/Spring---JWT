package com.unsis.spring.app.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Integer>{
    Optional<User> findByUsername(String username); 

    @Modifying
    @Query("update User u set u.username = :username, u.password = :password, u.role = :role where u.id = :id")
    void updateUser(@Param("id") Integer id, @Param("username") String username, @Param("password") String password, @Param("role") Role role);

    @Modifying
    @Query("update User u set u.enabled = :enabled where u.username = :username")
    void setEnabledByUsername(@Param("username") String username, @Param("enabled") boolean enabled);
}
