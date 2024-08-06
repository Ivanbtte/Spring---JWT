package com.unsis.spring.app.Service.BD1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.Repository.BD1.FileMetadataRepository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;


@Service
public class FileService {
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    public FileService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileMetadata saveFile(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        FileMetadata metadata = new FileMetadata();
        metadata.setFileName(fileName);
        metadata.setFilePath(targetLocation.toString());
        metadata.setFileType(file.getContentType());

        return fileMetadataRepository.save(metadata);
    }

    public InputStream loadFileAsResource(String filePath) throws IOException {
        Path path = Paths.get(filePath).normalize();
        return Files.newInputStream(path);
    }

    public FileMetadata getFileMetadata(Long id) {
        return fileMetadataRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found with id " + id));
    }
}
