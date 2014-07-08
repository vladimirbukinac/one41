package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.GenericDao;
import com.chess.one41.backend.service.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends GenericServiceImpl<User, String> implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public User authenticateUser(String username, String password) {
        return userDao.authenticateUser(username, password);
    }

    @Override
    protected GenericDao<User, String> getDao() {
        return userDao;
    }
}
