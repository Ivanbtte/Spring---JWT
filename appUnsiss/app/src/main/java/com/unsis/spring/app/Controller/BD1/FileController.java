package com.unsis.spring.app.Controller.BD1;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.unsis.spring.app.Entity.BD1.FileMetadata;
import com.unsis.spring.app.Service.BD1.FileService;

import java.io.IOException;
import java.io.InputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            logger.error("No file selected for upload.");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
}
