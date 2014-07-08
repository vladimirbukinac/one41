package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.UserDao;
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
        existingUser.setId("1");
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
}
