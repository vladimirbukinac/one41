package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.UserDao;
import com.chess.one41.backend.service.exception.IllegalOperationException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

public class UserServiceTest {

    @Mock
    private UserDao userDao;

    @InjectMocks
    private UserServiceImpl userService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void authenticateUserTest() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("testpass");

        Mockito.when(userDao.authenticateUser(existingUser.getUsername(), existingUser.getPassword())).thenReturn(existingUser);
        User foundUser = userService.authenticateUser(existingUser.getUsername(), existingUser.getPassword());
        Assert.assertNotNull(foundUser);
        Assert.assertEquals(foundUser.getId(), existingUser.getId());
        Assert.assertEquals(foundUser.getUsername(), existingUser.getUsername());
        Assert.assertEquals(foundUser.getPassword(), existingUser.getPassword());

        User nonExistingUser = new User();
        Mockito.when(userDao.authenticateUser(nonExistingUser.getUsername(), nonExistingUser.getPassword())).thenReturn(null);
        foundUser = userService.authenticateUser(nonExistingUser.getUsername(), nonExistingUser.getPassword());
        Assert.assertNull(foundUser);
    }

    @Test
    public void createOrEditUserTest() {
        String existingEmail1 = "existing1@email.com";
        String existingEmail2 = "existing2@email.com";
        String nonExistingEmail = "nonexisting@email.com";

        User existingUser1 = new User();
        existingUser1.setId(1L);
        existingUser1.setEmail(existingEmail1);

        User existingUser2 = new User();
        existingUser2.setId(2L);
        existingUser2.setEmail(existingEmail2);

        User newUserWithExistingEmail = new User();
        newUserWithExistingEmail.setEmail(existingEmail1);

        Mockito.when(userDao.getUserByEmail(existingUser1.getEmail())).thenReturn(existingUser1);
        Mockito.when(userDao.getUserByEmail(existingUser2.getEmail())).thenReturn(existingUser2);
        Mockito.when(userDao.getUserByEmail(nonExistingEmail)).thenReturn(null);

        // Try to create a new user with existing email
        try {
            userService.createOrUpdateUser(newUserWithExistingEmail);
            Assert.fail("Email " + newUserWithExistingEmail.getEmail() + " already exists, but was not detected.");
        } catch (IllegalOperationException e) {
            // Ok
        }

        // Try to update an existing user with another user's email
        existingUser1.setEmail(existingEmail2);
        try {
            userService.createOrUpdateUser(existingUser1);
            Assert.fail("Email " + existingEmail2 + " already exists, but was not detected.");
        } catch (IllegalOperationException e) {
            // Ok
        }

        // Happy flow, create new user
        User newUser = new User();
        newUser.setEmail(nonExistingEmail);
        try {
            userService.createOrUpdateUser(newUser);
        } catch (IllegalOperationException e) {
            Assert.fail("Failed to create user with email: " + newUser.getEmail());
        }

        // Happy flow, edit existing user
        existingUser2.setEmail(nonExistingEmail);
        try {
            userService.createOrUpdateUser(existingUser2);
        } catch (IllegalOperationException e) {
            Assert.fail("Failed to update user with email: " + existingUser2.getEmail());
        }
    }
}
