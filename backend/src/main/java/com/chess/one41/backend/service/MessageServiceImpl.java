package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.GenericDao;
import com.chess.one41.backend.service.dao.MessageDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageServiceImpl extends GenericServiceImpl<Message, Long> implements MessageService {

    @Autowired
    private MessageDao messageDao;

    @Autowired
    private UserService userService;

    @Override
    public void createEntity(Message message) {
        User user = userService.getEntity(message.getUserId());
        message.setUser(user);
        message.setCreationDate(new Date());

        super.createEntity(message);
    }

    @Override
    public List<Message> getLatestMessages() {
        return messageDao.getLatestMessages();
    }

    @Override
    protected GenericDao<Message, Long> getDao() {
        return messageDao;
    }
}
