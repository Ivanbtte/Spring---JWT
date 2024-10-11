package com.unsis.spring.app.Repository.BD1;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unsis.spring.app.Entity.BD1.FileMetadata;


@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
}
