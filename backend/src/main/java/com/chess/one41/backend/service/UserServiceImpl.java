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
    public User createOrUpdateUser(User user) throws IllegalOperationException {
        User userWithEmail = userDao.getUserByEmail(user.getEmail());

        boolean uniqueEmail = true;
        if (userWithEmail != null) {
            if (user.getId() == null) {
                uniqueEmail = false;
            } else if (!userWithEmail.getId().equals(user.getId())) {
                uniqueEmail = false;
            }
        }

        if (!uniqueEmail) {
            throw new IllegalOperationException();
        }

        if(user.getId() == null) {
            userDao.create(user);
        } else {
            userDao.update(user);
        }

        return user;
    }

    @Override
    protected GenericDao<User, Long> getDao() {
        return userDao;
    }
}
