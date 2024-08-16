package com.unsis.spring.app.Service.BD1;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.DTO.InstitutoDto;
import com.unsis.spring.app.DTO.InvestigadorDto;
import com.unsis.spring.app.Entity.BD1.Autor;
import com.unsis.spring.app.Entity.BD1.Instituto;
import com.unsis.spring.app.Entity.BD1.Investigador;
import com.unsis.spring.app.Repository.BD1.InvestigadorDao;
import com.unsis.spring.app.User.Role;
import com.unsis.spring.app.User.User;
import com.unsis.spring.app.User.UserDTO;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class InvestigadorServiceImpl implements InvestigadorService {

    @Autowired
    private InvestigadorDao investigadorDao;

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

}
