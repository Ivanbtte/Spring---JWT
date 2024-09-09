package com.unsis.spring.app.Service.BD1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.ExceptionHandler.ResourceNotFoundException;
import com.unsis.spring.app.Repository.BD1.FileMetadataRepository;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FileService {
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

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
        return fileMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id " + id));
    }

    /**
     * Elimina un archivo físico del sistema de archivos.
     * 
     * @param filePath La ruta completa del archivo a eliminar.
     * @throws IOException Si ocurre un error al intentar eliminar el archivo.
     */
    public void deleteFile(Long id) throws IOException {
        // Buscar los metadatos existentes en la base de datos
        FileMetadata metadata = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new IOException("No se encontraron metadatos para el ID proporcionado: " + id));
        // Eliminar el archivo del sistema de archivos
        Path filePath = Paths.get(metadata.getFilePath()).normalize();
        Files.deleteIfExists(filePath);
        // Eliminar los metadatos de la base de datos
        fileMetadataRepository.deleteById(id);
    }

    /**
     * Actualiza los metadatos de un archivo existente.
     * 
     * @param id              El ID del archivo cuyos metadatos se van a actualizar.
     * @param updatedMetadata Los nuevos metadatos que se desean aplicar.
     * @return Los metadatos actualizados.
     * @throws ResourceNotFoundException Si no se encuentra el archivo con el ID
     *                                   especificado.
     */
    @Transactional

    public FileMetadata updateFileMetadata(Long id, MultipartFile newFile) throws IOException {
        // Buscar los metadatos existentes en la base de datos
        FileMetadata metadata = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new IOException("No se encontraron metadatos para el ID proporcionado: " + id));
        // Validar que el archivo no esté vacío
        if (newFile.isEmpty()) {
            throw new IOException("El archivo seleccionado para la actualización está vacío.");
        }
        // Validar que el tipo de archivo sea PDF
        if (!newFile.getContentType().equals("application/pdf")) {
            throw new IOException("Tipo de archivo inválido: " + newFile.getContentType());
        }
        // Reemplazar el archivo en el sistema de archivos o almacenamiento
        Path oldFilePath = Paths.get(metadata.getFilePath()).normalize();
        Files.deleteIfExists(oldFilePath);
        String newFileName = newFile.getOriginalFilename();
        Path targetLocation = this.fileStorageLocation.resolve(newFileName);
        Files.copy(newFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        // Actualizar los campos con los nuevos valores
        metadata.setFileName(newFileName);
        metadata.setFilePath(targetLocation.toString());
        metadata.setFileType(newFile.getContentType());
        // Guardar los cambios en la base de datos
        return fileMetadataRepository.save(metadata);
    }

}
