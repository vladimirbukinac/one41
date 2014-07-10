package com.chess.one41.backend.dao;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.UserDao;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UserDaoTest extends BaseIntegrationTest {

    @Autowired
    private UserDao userDao;

    @Test
    public void authenticateUserTest() {
        User existingUser = new User();
        existingUser.setUsername("alekdov");
        existingUser.setPassword("pass");
        userDao.create(existingUser);

        User authenticatedUser = userDao.authenticateUser(existingUser.getUsername(), existingUser.getPassword());
        Assert.assertNotNull(authenticatedUser);
        Assert.assertEquals(existingUser.getId(), authenticatedUser.getId());

        // Wrong password
        authenticatedUser = userDao.authenticateUser(existingUser.getUsername(), existingUser.getPassword() + "x");
        Assert.assertNull(authenticatedUser);
    }
}
