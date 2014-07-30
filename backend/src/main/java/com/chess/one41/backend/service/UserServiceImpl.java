package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.GenericDao;
import com.chess.one41.backend.service.dao.UserDao;
import com.chess.one41.backend.service.exception.IllegalOperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, Long> implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public User authenticateUser(String username, String password) {
        return userDao.authenticateUser(username, password);
    }

    @Override
    public void checkUsernameAndEmailUnique(User user) throws IllegalOperationException {
        User userWithUsername = userDao.getUserByUsername(user.getUsername());
        User userWithEmail = userDao.getUserByEmail(user.getEmail());

        if (userWithUsername != null && !userWithUsername.getId().equals(user.getId())) {
            throw new IllegalOperationException();
        }
        if (userWithEmail != null && !userWithEmail.getId().equals(user.getId())) {
            throw new IllegalOperationException();
        }
    }

    @Override
    protected GenericDao<User, Long> getDao() {
        return userDao;
    }
}
