package com.chess.one41.backend.dao;

import com.chess.one41.backend.entity.Image;
import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.ImageDao;
import com.chess.one41.backend.service.dao.MessageDao;
import com.chess.one41.backend.service.dao.UserDao;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MessageDaoTest extends BaseIntegrationTest {

    @Autowired
    private MessageDao messageDao;

    @Autowired
    private UserDao userDao;


    @Test
    public void createSimpleMessageTest() {
        User existingUser = new User();
        existingUser.setUsername("test");
        existingUser.setPassword("test");
        existingUser.setEmail("test@email.com");
        userDao.create(existingUser);

        Message message = new Message();
        message.setUser(existingUser);
        message.setText("Text");
        Date currentDate = new Date();
        message.setCreationDate(new Date(currentDate.getTime()));
        messageDao.create(message);

        //Message fetchedMessage = messageDao.getMessageWithImages(message.getId());
        Message fetchedMessage = messageDao.findById(message.getId());

        Assert.assertNotNull(fetchedMessage);
        Assert.assertEquals(fetchedMessage.getText(), message.getText());
    }

    @Test
    public void retrieveMessageWithoutImagesTest() {
        User existingUser = new User();
        existingUser.setUsername("test");
        existingUser.setPassword("test");
        existingUser.setEmail("test@email.com");
        userDao.create(existingUser);

        Message message = new Message();
        message.setUser(existingUser);
        message.setText("Text");
        Date currentDate = new Date();
        message.setCreationDate(new Date(currentDate.getTime()));
        messageDao.create(message);

        Message fetchedMessage = messageDao.getMessageWithImages(message.getId());

        Assert.assertNotNull(fetchedMessage);
        Assert.assertEquals(fetchedMessage.getText(), message.getText());
    }

    @Test
    public void retrieveMessageWithImageTest() {
        User existingUser = new User();
        existingUser.setUsername("test");
        existingUser.setPassword("test");
        existingUser.setEmail("test@email.com");
        userDao.create(existingUser);

        Message message = new Message();
        message.setUser(existingUser);
        message.setText("Text");
        Date currentDate = new Date();
        message.setCreationDate(new Date(currentDate.getTime()));


        List<Image> images = new ArrayList<Image>();
        Image image = new Image();
        image.setImage(new byte[]{1, 2, 3});
        image.setMessage(message);
        String testImageName = "Test image name";
        image.setName(testImageName);
        images.add(image);
        message.setImages(images);

        messageDao.create(message);


        Message fetchedMessage = messageDao.getMessageWithImages(message.getId());

        Assert.assertNotNull(fetchedMessage);
        Assert.assertEquals(fetchedMessage.getText(), message.getText());

        Assert.assertNotNull(fetchedMessage.getImages());
        Assert.assertEquals(fetchedMessage.getImages().size(), 1);

        Image fetchedImage = fetchedMessage.getImages().get(0);
        Assert.assertNotNull(fetchedImage);
        Assert.assertEquals(fetchedImage.getName(), testImageName);

    }

    @Test
    public void retrieveMessageWithMultipleImagesTest() {
        User existingUser = new User();
        existingUser.setUsername("test");
        existingUser.setPassword("test");
        existingUser.setEmail("test@email.com");
        userDao.create(existingUser);

        Message message = new Message();
        message.setUser(existingUser);
        message.setText("Text");
        Date currentDate = new Date();
        message.setCreationDate(new Date(currentDate.getTime()));


        List<Image> images = new ArrayList<Image>();
        String testImageName = "Test image name";

        Image image = new Image();
        image.setImage(new byte[]{1, 2, 3});
        image.setMessage(message);
        image.setName(testImageName);
        images.add(image);

        image = new Image();
        image.setImage(new byte[]{1, 2, 3});
        image.setMessage(message);
        image.setName(testImageName);
        images.add(image);

        message.setImages(images);

        messageDao.create(message);


        Message fetchedMessage = messageDao.getMessageWithImages(message.getId());

        Assert.assertNotNull(fetchedMessage);
        Assert.assertEquals(fetchedMessage.getText(), message.getText());

        Assert.assertNotNull(fetchedMessage.getImages());
        Assert.assertEquals(fetchedMessage.getImages().size(), 2);

        Image fetchedImage = fetchedMessage.getImages().get(0);
        Assert.assertNotNull(fetchedImage);
        fetchedImage = fetchedMessage.getImages().get(1);
        Assert.assertNotNull(fetchedImage);

    }

    @Test
    public void getLatestMessagesTest() {
        User existingUser = new User();
        existingUser.setUsername("alekdov");
        existingUser.setPassword("pass");
        existingUser.setEmail("email@email.com");
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
