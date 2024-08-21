package com.unsis.spring.app.Service.BD1;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.Repository.BD1.FileMetadataRepository;

import java.nio.file.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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

    // Nuevo método para crear un ZIP
    public ResponseEntity<Resource> createZipFromFilteredFiles(List<Long> fileMetadataIds) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (Long fileId : fileMetadataIds) {
                FileMetadata metadata = fileMetadataRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found with id " + fileId));
                InputStream is = Files.newInputStream(Paths.get(metadata.getFilePath()));
                zos.putNextEntry(new ZipEntry(metadata.getFileName()));
                byte[] buffer = new byte[1024];
                int len;
                while ((len = is.read(buffer)) > 0) {
                    zos.write(buffer, 0, len);
                }
                zos.closeEntry();
                is.close();
            }
        }
        ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=filtered_files.zip");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.contentLength())
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
