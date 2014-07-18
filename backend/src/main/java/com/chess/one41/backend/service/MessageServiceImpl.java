package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.dao.GenericDao;
import com.chess.one41.backend.service.dao.MessageDao;
import com.chess.one41.backend.service.exception.EntityNotFoundException;
import com.chess.one41.backend.service.exception.IllegalOperationException;
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
    public void createEntity(Message message) throws EntityNotFoundException {
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
    public Message getMessageWithImages(Long messageId) throws EntityNotFoundException {
        getEntity(messageId); // check if message exists
        return messageDao.getMessageWithImages(messageId);
    }

    @Override
    public void deleteMessage(Long messageId, Long userId) throws EntityNotFoundException, IllegalOperationException {
        Message message = getEntity(messageId);
        if (!message.getUser().getId().equals(userId)) {
            throw new IllegalOperationException();
        }

        deleteEntity(message);
    }

    @Override
    protected GenericDao<Message, Long> getDao() {
        return messageDao;
    }
}
