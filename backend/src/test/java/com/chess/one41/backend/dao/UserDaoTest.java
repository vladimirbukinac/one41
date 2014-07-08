package com.chess.one41.backend.dao;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.UserDao;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "/META-INF/applicationContext-test.xml")
@Transactional
public class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Test
    public void authenticateUserTest() {
        User user = new User();
        user.setUsername("alekdov");
        user.setPassword("pass");
        userDao.create(user);

        User auth = userDao.authenticateUser(user.getUsername(), user.getPassword());
        Assert.assertNotNull(auth);
        Assert.assertEquals(user.getId(), auth.getId());
    }
}
