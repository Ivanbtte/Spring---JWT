package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;
import java.io.InputStream;
import java.util.Optional;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;

import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.DTO.InstitutoDto;
import com.unsis.spring.app.DTO.InvestigadorDto;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Entity.BD1.Investigador;
import com.unsis.spring.app.Repository.BD1.AutorDao;
import com.unsis.spring.app.Repository.BD1.InstitutoDao;
import com.unsis.spring.app.Repository.BD1.InvestigadorDao;
import com.unsis.spring.app.User.Role;
import com.unsis.spring.app.User.User;
import com.unsis.spring.app.User.UserDTO;
import com.unsis.spring.app.User.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class InvestigadorServiceImpl implements InvestigadorService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvestigadorDao investigadorDao;

    @Autowired
    private InstitutoDao institutoDao;

    @Autowired
    private AutorDao autorDao;

    @Override
    @Transactional
    public List<InvestigadorDto> findAll() {
        return investigadorDao.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InvestigadorDto save(InvestigadorDto investigadorDto) {
        Investigador investigador = convertToEntity(investigadorDto);
        Investigador savedInvestigador = investigadorDao.save(investigador);
        return convertToDto(savedInvestigador);
    }

    @Override
    public InvestigadorDto findById(Long id) {
        Investigador investigador = investigadorDao.findById(id).orElse(null);
        return convertToDto(investigador);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Investigador investigador = investigadorDao.findById(id).orElse(null);
        if (investigador != null) {
            investigadorDao.delete(investigador);
        }
    }

    @Override
    @Transactional
    public List<InvestigadorDto> findByInstitutoId(Long institutoId) {
        return investigadorDao.findByInstitutoId(institutoId).stream().map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private InvestigadorDto convertToDto(Investigador investigador) {
        InvestigadorDto dto = new InvestigadorDto();
        dto.setId(investigador.getId());
        if (investigador.getNum_empleado() != null) {
            dto.setNum_empleado(investigador.getNum_empleado());
        }
        if (investigador.getNombre_1_investigador() != null) {
            dto.setNombre_1_investigador(investigador.getNombre_1_investigador());
        }
        if (investigador.getNombre_2_investigador() != null) {
            dto.setNombre_2_investigador(investigador.getNombre_2_investigador());
        }
        if (investigador.getApellido_paterno_1_investigador() != null) {
            dto.setApellido_paterno_1_investigador(investigador.getApellido_paterno_1_investigador());
        }
        if (investigador.getApellido_materno_2_investigador() != null) {
            dto.setApellido_materno_2_investigador(investigador.getApellido_materno_2_investigador());
        }
        if (investigador.getUser() != null) {
            dto.setUser(convertToUserDto(investigador.getUser()));
        }
        if (investigador.getInstituto() != null) {
            dto.setInstituto(convertToInstitutoDto(investigador.getInstituto()));
        }
        if (investigador.getAutor() != null) {
            dto.setAutor(convertToAutorDto(investigador.getAutor()));
        }
        return dto;
    }

    private Investigador convertToEntity(InvestigadorDto dto) {
        Investigador investigador = new Investigador();
        investigador.setId(dto.getId());
        if (dto.getNum_empleado() != null) {
            investigador.setNum_empleado(dto.getNum_empleado());
        }
        if (dto.getNombre_1_investigador() != null) {
            investigador.setNombre_1_investigador(dto.getNombre_1_investigador());
        }
        if (dto.getNombre_2_investigador() != null) {
            investigador.setNombre_2_investigador(dto.getNombre_2_investigador());
        }
        if (dto.getApellido_paterno_1_investigador() != null) {
            investigador.setApellido_paterno_1_investigador(dto.getApellido_paterno_1_investigador());
        }
        if (dto.getApellido_materno_2_investigador() != null) {
            investigador.setApellido_materno_2_investigador(dto.getApellido_materno_2_investigador());
        }
        if (dto.getUser() != null) {
            investigador.setUser(convertToUser(dto.getUser()));
        }
        if (dto.getInstituto() != null) {
            investigador.setInstituto(convertToInstituto(dto.getInstituto()));
        }
        if (dto.getAutor() != null) {
            investigador.setAutor(convertToAutor(dto.getAutor()));
        }
        return investigador;
    }

    private UserDTO convertToUserDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(user.getId(), user.getUsername(), user.getRole().name(), user.isEnabled());
    }

    private User convertToUser(UserDTO userDto) {
        if (userDto == null) {
            return null;
        }
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setRole(Role.valueOf(userDto.getRole()));
        return user;
    }

    private InstitutoDto convertToInstitutoDto(Instituto instituto) {
        return new InstitutoDto(instituto.getId(), instituto.getNombre());
    }

    private Instituto convertToInstituto(InstitutoDto institutoDto) {
        Instituto instituto = new Instituto();
        instituto.setId(institutoDto.getId());
        instituto.setNombre(institutoDto.getNombre());
        return instituto;
    }

    private AutorDto convertToAutorDto(Autor autor) {
        return new AutorDto(autor.getId_autor(), autor.getNombre1Autor(), autor.getNombre2Autor(),
                autor.getApellidoPaternoAutor(), autor.getApellidoMaternoAutor(),
                autor.getAutorUnsis()); // Assuming articulos are null for now
    }

    private Autor convertToAutor(AutorDto autorDto) {
        Autor autor = new Autor();
        autor.setId_autor(autorDto.getId_autor());
        autor.setNombre1Autor(autorDto.getNombre1Autor());
        autor.setNombre2Autor(autorDto.getNombre2Autor());
        autor.setApellidoPaternoAutor(autorDto.getApellidoPaternoAutor());
        autor.setApellidoMaternoAutor(autorDto.getApellidoMaternoAutor());
        autor.setAutorUnsis(autorDto.getAutorUnsis());
        // Assuming articulos are not set for now
        return autor;
    }

    @Override
    public InvestigadorDto findByIdUser(Long userId) {
        // Usamos la consulta para obtener una lista de Investigadores asociados al
        // usuario
        List<Investigador> investigadores = investigadorDao.findByUser2(userId);

        // Nos aseguramos de que hay al menos un investigador en la lista
        if (investigadores.isEmpty()) {
            throw new EntityNotFoundException("No se encontró investigador para el ID de usuario: " + userId);
        }

        // Convertimos el primer investigador de la lista a InvestigadorDto
        Investigador investigador = investigadores.get(0);
        return convertToDto(investigador);
    }

    @Override
    public List<InvestigadorDto> findInvestigadoresHabilitados() {
        // Usamos la consulta para obtener una lista de Investigadores cuyos usuarios
        // están habilitados
        List<Investigador> investigadoresHabilitados = investigadorDao.findInvestigadoresHabilitados();

        // Convertimos la lista de investigadores a una lista de InvestigadorDto
        return investigadoresHabilitados.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvestigadorDto> findInvestigadoresHabilitadosPorInstituto(Long institutoId) {
        // Usamos la consulta para obtener una lista de Investigadores habilitados
        // filtrados por instituto
        List<Investigador> investigadoresHabilitadosPorInstituto = investigadorDao
                .findInvestigadoresHabilitadosPorInstituto(institutoId);

        // Convertimos la lista de investigadores a una lista de InvestigadorDto
        return investigadoresHabilitadosPorInstituto.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void cargarInvestigadoresDesdeExcel(InputStream excelInputStream) throws Exception {
        Workbook workbook = new XSSFWorkbook(excelInputStream);
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            if (row.getRowNum() < 2)
                continue; // Salta la fila de encabezado

            Investigador investigador = new Investigador();

            String nombre1 = row.getCell(0).getStringCellValue();
            investigador.setNombre_1_investigador(nombre1);

            String nombre2 = row.getCell(1).getStringCellValue();
            investigador.setNombre_2_investigador(nombre2);

            String apellidoPaterno = row.getCell(2).getStringCellValue();
            investigador.setApellido_paterno_1_investigador(apellidoPaterno);

            String apellidoMaterno = row.getCell(3).getStringCellValue();
            investigador.setApellido_materno_2_investigador(apellidoMaterno);

            String nombreInstituto = row.getCell(4).getStringCellValue();
            Optional<Instituto> institutoOpt = institutoDao.findByNombre(nombreInstituto);
            if (institutoOpt.isPresent()) {
                investigador.setInstituto(institutoOpt.get());
            } else {
                throw new RuntimeException("Instituto no encontrado: " + nombreInstituto);
            }

            // Crear y asignar usuario
            User user = new User();
            user.setUsername(row.getCell(5).getStringCellValue());
            // Convierte el string del Excel a un tipo enum
            String roleString = row.getCell(6).getStringCellValue().toUpperCase(); // Asegúrate que el valor sea todo con mayúsculas
            Role role = Role.valueOf(roleString);
            user.setRole(role);
            user.setPassword(passwordEncoder.encode(row.getCell(7).getStringCellValue()));
            user.setEnabled(true); // asegúrate de cifrar el password
            userRepository.save(user);
            investigador.setUser(user);

            // Crear y asignar autor
            Autor autor = new Autor();
            autor.setNombre1Autor(nombre1);
            autor.setNombre2Autor(nombre2);
            autor.setApellidoPaternoAutor(apellidoPaterno);
            autor.setApellidoMaternoAutor(apellidoMaterno);
            autor.setAutorUnsis(true);
            autorDao.save(autor);
            investigador.setAutor(autor);

            investigadorDao.save(investigador);
        }

        workbook.close();
    }
}
