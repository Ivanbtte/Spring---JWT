package com.unsis.spring.app.Service.BD1;

import java.util.List;

import com.unsis.spring.app.User.User;

public interface UserService {
    public List<User> findAll();
	
	public User save(User rol);
	
	public User findById(Integer id);
	
	public void delete(User rol);
}
