package com.chess.one41.backend.dao;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.MessageDao;
import com.chess.one41.backend.service.dao.UserDao;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public class MessageDaoTest extends BaseIntegrationTest {

    @Autowired
    private MessageDao messageDao;

    @Autowired
    private UserDao userDao;

    @Test
    public void getLatestMessagesTest() {
        User existingUser = new User();
        existingUser.setUsername("alekdov");
        existingUser.setPassword("pass");
        userDao.create(existingUser);

        for (int i = 0; i < 13; i++) {
            Message message = new Message();
            message.setUser(existingUser);
            message.setText("Text number " + i);
            Date currentDate = new Date();
            message.setCreationDate(new Date(currentDate.getTime() + i * 1000));
            messageDao.create(message);
        }

        List<Message> latestMessages = messageDao.getLatestMessages();

        Assert.assertNotNull(latestMessages);
        Assert.assertEquals(latestMessages.size(), 10);
        Assert.assertTrue(latestMessages.get(0).getCreationDate().after(latestMessages.get(1).getCreationDate()));
    }
}
