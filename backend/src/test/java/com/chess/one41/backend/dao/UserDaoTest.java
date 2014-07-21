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

    @Test
    public void getUserByEmailTest() {
        String email1 = "email1@email.com";
        String email2 = "email2@email.com";
        String emailNonExisting = "email3@email.com";

        User user1 = new User();
        user1.setEmail(email1);
        userDao.create(user1);

        User user2 = new User();
        user2.setEmail(email2);
        userDao.create(user2);

        // Non existing email
        Assert.assertNull(userDao.getUserByEmail(emailNonExisting));

        // Get user by email
        User user = userDao.getUserByEmail(email1);
        Assert.assertNotNull(user);
        Assert.assertEquals(user.getEmail(), email1);
    }
}
