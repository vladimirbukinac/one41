package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.MessageDao;
import com.chess.one41.backend.service.dao.UserDao;
import com.chess.one41.backend.service.exception.EntityNotFoundException;
import com.chess.one41.backend.service.exception.IllegalOperationException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.Date;

public class MessageServiceTest {

    @Mock
    private MessageDao messageDao;

    @Mock
    private UserService userService;

    @Mock
    private TimeService timeService;

    @InjectMocks
    private MessageServiceImpl messageService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void createEntityTest() {

        // Setup user
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("testpass");

        //Setup user's message
        Message message = new Message();
        message.setText("Test text");
        message.setUserId(existingUser.getId());

        Date currentTime = new Date();
        // Mock Time
        Mockito.when(timeService.getCurrentTime()).thenReturn(currentTime);
        // Mock checking and returning user
        Mockito.when(userService.findEntity(existingUser.getId())).thenReturn(existingUser);
        // Mocking a dao is not needed since successful execution has no return value

        // Testing method call
        messageService.createEntity(message);

        // verify correct dependant methods were called
        Mockito.verify(userService, Mockito.times(1)).findEntity(existingUser.getId());
        Mockito.verify(messageDao, Mockito.times(1)).create(message);

        Assert.assertEquals(currentTime.getTime(), message.getCreationDate().getTime());

        // verifying returned value is not needed since successful execution has no return value
    }

    @Test
    public void deleteEntityTest() {

        // Setup user
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("testpass");

        //Setup user's message
        Message message = new Message();
        message.setId(11L);
        message.setText("Test text");
        message.setUserId(existingUser.getId());
        message.setUser(existingUser);

        Date currentTime = new Date();
        // Mocking a dao
        Mockito.when(messageDao.findById(message.getId())).thenReturn(message);

        // Testing method call
        try {
            messageService.deleteMessage(message.getId(), existingUser.getId());
        } catch (EntityNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalOperationException e) {
            e.printStackTrace();
        }
        // verify correct dependant methods were called
        Mockito.verify(messageDao, Mockito.times(1)).findById(message.getId());
        Mockito.verify(messageDao, Mockito.times(1)).delete(message);

        // verifying returned value is not needed since successful execution has no return value
    }

    @Test(expected=IllegalOperationException.class)
    public void deleteEntityWrongUserTest() throws IllegalOperationException {

        // Setup user
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("testpass");

        User wrongUser = new User();
        wrongUser.setId(2L);
        wrongUser.setUsername("wrongUser");
        wrongUser.setPassword("wrongUserpass");

        //Setup user's message
        Message message = new Message();
        message.setId(11L);
        message.setText("Test text");
        message.setUserId(existingUser.getId());
        message.setUser(existingUser);

        Date currentTime = new Date();
        // Mocking a dao
        Mockito.when(messageDao.findById(message.getId())).thenReturn(message);

        // Testing method call
        try {
            messageService.deleteMessage(message.getId(), wrongUser.getId());
        } catch (EntityNotFoundException e) {
            e.printStackTrace();
        }
        // verify correct dependant methods were called
        Mockito.verify(messageDao, Mockito.times(1)).findById(message.getId());
        Mockito.verify(messageDao, Mockito.times(0)).delete(message);

        // verifying returned value is not needed since successful execution has no return value
    }

    @Test(expected=EntityNotFoundException.class)
    public void deleteEntityNotFoundTest() throws EntityNotFoundException {

        // Setup user
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("testpass");

        //Setup user's message
        Message message = new Message();
        message.setId(11L);
        message.setText("Test text");
        message.setUserId(existingUser.getId());
        message.setUser(existingUser);

        Date currentTime = new Date();
        // Mocking a dao
        Mockito.when(messageDao.findById(message.getId())).thenReturn(null);

        // Testing method call
        try {
            messageService.deleteMessage(message.getId(), existingUser.getId());
        } catch (IllegalOperationException e) {
            e.printStackTrace();
        }
        // verify correct dependant methods were called
        Mockito.verify(messageDao, Mockito.times(1)).findById(message.getId());
        Mockito.verify(messageDao, Mockito.times(0)).delete(message);

        // verifying returned value is not needed since successful execution has no return value
    }
}
