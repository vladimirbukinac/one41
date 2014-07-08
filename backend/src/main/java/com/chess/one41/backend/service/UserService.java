package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;

public interface UserService extends GenericService<User, Long> {

    User authenticateUser(String username, String password);
}
