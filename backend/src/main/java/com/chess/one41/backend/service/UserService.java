package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;

public interface UserService extends GenericService<User, String> {

    User authenticateUser(String username, String password);
}
