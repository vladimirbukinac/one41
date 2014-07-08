package com.chess.one41.backend.service.dao;

import com.chess.one41.backend.entity.User;

public interface UserDao extends GenericDao<User, String> {

    User authenticateUser(String username, String password);
}
