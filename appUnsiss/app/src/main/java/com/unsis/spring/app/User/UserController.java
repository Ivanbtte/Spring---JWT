package com.unsis.spring.app.User;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.DocumentException;
import com.unsis.spring.app.Auth.AuthResponse;
import com.unsis.spring.app.ReportPDF.UserReportExcel;
import com.unsis.spring.app.ReportPDF.UserReportPDf;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200"})
public class UserController {
     
    private final UserService userService;

	@GetMapping(value = "/user")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

	@GetMapping(value = "/user/{id}")
	public ResponseEntity<UserDTO> getUser(@PathVariable Integer id) {
        UserDTO userDTO = userService.getUser(id);
        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping(value = "/user") 
    public ResponseEntity<UserRegistrationResponse> register(@RequestBody UserRequestRol request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(userRequest));
    }

    @PutMapping("/user/{id}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable Integer id) {
        userService.enableUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Integer id) {
        userService.disableUser(id);
        return ResponseEntity.ok().build();
    }

   /* @GetMapping(value = "/user/exportarPDF")
    public void exportarPDFDeUsuarios(HttpServletResponse response) throws DocumentException, IOException{
        response.setContentType("application/pdf");

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String fechaActual = dateFormatter.format(new Date());

        String cabecera = "Content-Disposition";
        String valor = "attachment; filename=Usuarios_" + fechaActual + ".pdf";

        response.setHeader(cabecera, valor);

        List<UserDTO> usuarios = userService.getAllUsers();
     
        UserReportPDf exporter = new UserReportPDf(usuarios);
        exporter.exportar(response);
    }

    @GetMapping(value = "/user/exportarExel")
    public void exportarExelDeUsuarios(HttpServletResponse response) throws DocumentException, IOException{
        response.setContentType("application/octet-stream");

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String fechaActual = dateFormatter.format(new Date());

        String cabecera = "Content-Disposition";
        String valor = "attachment; filename=Usuarios_" + fechaActual + ".xlsx";

        response.setHeader(cabecera, valor);

        List<UserDTO> usuarios = userService.getAllUsers();
     
        UserReportExcel exporter = new UserReportExcel(null, null, usuarios);
        exporter.exportar(response);
    }*/

}
