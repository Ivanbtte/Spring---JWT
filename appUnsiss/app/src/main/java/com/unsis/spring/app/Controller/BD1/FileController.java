package com.unsis.spring.app.Controller.BD1;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.Service.BD1.ArticuloService;
import com.unsis.spring.app.Service.BD1.FileService;

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

    @PutMapping("/update/{id}")
    public ResponseEntity<FileMetadata> updateFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        // Validar que el archivo no esté vacío
        if (file.isEmpty()) {
            logger.error("No file selected for update.");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // Validar que el tipo de archivo sea PDF
        if (!file.getContentType().equals("application/pdf")) {
            logger.error("Invalid file type: " + file.getContentType());
            return new ResponseEntity<>(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
        // Actualizar el archivo y los metadatos correspondientes
        try {
            FileMetadata updatedMetadata = fileService.updateFileMetadata(id, file);
            logger.info("Archivo actualizado");
            return new ResponseEntity<>(updatedMetadata, HttpStatus.OK);
        } catch (IOException e) {
            logger.error("Error updating file: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
                    criteria.getTipo(),
                    criteria.getEstatus());

            // Extraer file_metadata_id de los resultados filtrados
            List<Long> fileMetadataIds = articulos.stream()
                    .map(articulo -> (Long) articulo[23]) // Suponiendo que file_metadata_id está en la posición 22
                    .collect(Collectors.toList());

            // Crear y devolver el archivo ZIP
            return fileService.createZipFromFilteredFiles(fileMetadataIds);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/descargar-formato")
    public ResponseEntity<Resource> descargarFormatoExcel() {
        try {
            Path path = Paths.get("uploads/Static/CargarUsuarios.xlsx").normalize();
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists()) {
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=formato_investigadores.xlsx");
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
