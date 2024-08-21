package com.unsis.spring.app.Controller.BD1;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.Service.BD1.ArticuloService;
import com.unsis.spring.app.Service.BD1.FileService;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileService fileService;

    @Autowired
    private ArticuloService articuloService;


    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            logger.error("No file selected for upload.");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!file.getContentType().equals("application/pdf")) {
            logger.error("Invalid file type: " + file.getContentType());
            return new ResponseEntity<>(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }

        logger.info("File received: " + file.getOriginalFilename());
        FileMetadata metadata = fileService.saveFile(file);
        return new ResponseEntity<>(metadata, HttpStatus.OK);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) throws IOException {
        FileMetadata metadata = fileService.getFileMetadata(id);
        InputStream resource = fileService.loadFileAsResource(metadata.getFilePath());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(IOUtils.toByteArray(resource));
    }

    @PostMapping("/download-zip")
    public ResponseEntity<Resource> downloadZipFile(@RequestBody SearchCriteria criteria) {
        try {
            // Obtener los artículos filtrados
            List<Object[]> articulos = articuloService.findFilteredArticulos(
                    criteria.getInstitutoId(),
                    criteria.getAutorId(),
                    criteria.getFechaInicio(),
                    criteria.getFechaFin(),
                    criteria.getTipo());

            // Extraer file_metadata_id de los resultados filtrados
            List<Long> fileMetadataIds = articulos.stream()
                    .map(articulo -> (Long) articulo[22]) // Suponiendo que file_metadata_id está en la posición 22
                    .collect(Collectors.toList());

            // Crear y devolver el archivo ZIP
            return fileService.createZipFromFilteredFiles(fileMetadataIds);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
