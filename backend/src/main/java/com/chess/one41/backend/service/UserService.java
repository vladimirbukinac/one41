package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.exception.IllegalOperationException;

public interface UserService extends GenericService<User, Long> {

    User authenticateUser(String username, String password);

    User createOrUpdateUser(User user) throws IllegalOperationException;
}
