package com.unsis.spring.app.Service.BD1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import com.unsis.spring.app.User.User;
import com.unsis.spring.app.User.UserRepository;

@Service
public class UserServiceImpl implements UserService{

@Autowired
	private UserRepository userRepository;

   @Override
	@Transactional
	public List<User> findAll() {
		return (List<User>) userRepository.findAll();
	}

	@Override
	@Transactional
	public User save(User user) {
		return userRepository.save(user);
	}

	@Override 
	public User findById(Integer id) {
		return userRepository.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void delete(User user) {
		userRepository.delete(user);
		
	}
    
}
