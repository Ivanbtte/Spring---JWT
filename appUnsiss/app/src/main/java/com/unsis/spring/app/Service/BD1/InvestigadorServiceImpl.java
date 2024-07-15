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

import jakarta.transaction.Transactional;

@Service
public class InvestigadorServiceImpl implements InvestigadorService{
    
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

    private InvestigadorDto convertToDto(Investigador investigador) {
        InvestigadorDto dto = new InvestigadorDto();
        dto.setId(investigador.getId());
        dto.setNum_empleado(investigador.getNum_empleado());
        dto.setNombre_1_investigador(investigador.getNombre_1_investigador());
        dto.setNombre_2_investigador(investigador.getNombre_2_investigador());
        dto.setApellido_paterno_1_investigador(investigador.getApellido_paterno_1_investigador());
        dto.setApellido_materno_2_investigador(investigador.getApellido_materno_2_investigador());
        dto.setUser(convertToUserDto(investigador.getUser())); // Conversión aquí
        dto.setInstituto(convertToInstitutoDto(investigador.getInstituto()));
        dto.setAutor(convertToAutorDto(investigador.getAutor()));
        return dto;
    }

    private Investigador convertToEntity(InvestigadorDto dto) {
        Investigador investigador = new Investigador();
        investigador.setId(dto.getId());
        investigador.setNum_empleado(dto.getNum_empleado());
        investigador.setNombre_1_investigador(dto.getNombre_1_investigador());
        investigador.setNombre_2_investigador(dto.getNombre_2_investigador());
        investigador.setApellido_paterno_1_investigador(dto.getApellido_paterno_1_investigador());
        investigador.setApellido_materno_2_investigador(dto.getApellido_materno_2_investigador());
        investigador.setUser(convertToUser(dto.getUser()));
        investigador.setInstituto(convertToInstituto(dto.getInstituto()));
        investigador.setAutor(convertToAutor(dto.getAutor()));
        return investigador;
    }

    private UserDTO convertToUserDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(user.getId(), user.getUsername(), user.getRole().name());
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
            autor.getAutorUnsis(), null); // Assuming articulos are null for now
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
}
