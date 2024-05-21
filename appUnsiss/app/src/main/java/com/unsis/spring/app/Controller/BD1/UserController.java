package com.unsis.spring.app.Controller.BD1;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unsis.spring.app.User.User;
import com.unsis.spring.app.Service.BD1.UserService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:4200"})
public class UserController {
     
    @Autowired
	private UserService userService;

    @GetMapping(value="/user")
	public ResponseEntity<Object> get(){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<User> list  = userService.findAll();
			return new ResponseEntity<Object>(list,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @GetMapping(value="/user/{id}")
     public ResponseEntity<Object> getById(@PathVariable Integer id){ 
         try {
            User data  = userService.findById(id);
             return new ResponseEntity<Object>(data,HttpStatus.OK);
         } 
         catch (Exception e) {
             Map<String, Object> map = new HashMap<String, Object>();
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @PostMapping(value="/user")
	public ResponseEntity<Object> create(@RequestBody User user){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			User res = userService.save(user);  
			return new ResponseEntity<Object>(res,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}

     @PutMapping("/user/{id}")
     public ResponseEntity<Object> update(@RequestBody User user, @PathVariable Integer id){ 
         Map<String, Object> map = new HashMap<String, Object>();
         try {
             
			User currentrUser = userService.findById(id);
            
            currentrUser.setUsername(user.getUsername());
            currentrUser.setApellidoP(user.getApellidoP());
            currentrUser.setNombres(user.getNombres());
            currentrUser.setApellidoM(user.getApellidoM());
            currentrUser.setPassword(user.getPassword());
            currentrUser.setRole(user.getRole());
             
			User updatedUser = userService.save(currentrUser);
             
            return new ResponseEntity<Object>(updatedUser,HttpStatus.OK);
         } 
         catch (Exception e) {
             map.put("message", e.getMessage());
             return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
         } 
      }

      @DeleteMapping("/user/{id}")
	public ResponseEntity<Object> delete(@PathVariable Integer id){ 
		Map<String, Object> map = new HashMap<String, Object>();
		try { 
			User currentrUser = userService.findById(id); 
			userService.delete(currentrUser);
			map.put("deleted", true);
			return new ResponseEntity<Object>(map,HttpStatus.OK);
		} 
		catch (Exception e) {
			map.put("message", e.getMessage());
			return new ResponseEntity<>( map, HttpStatus.INTERNAL_SERVER_ERROR);
		} 
 	}
}
