package com.chess.one41.backend.service.dao;

import com.chess.one41.backend.entity.Message;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MessageDaoImpl extends GenericDaoImpl<Message, Long> implements MessageDao {

    @Override
    public List<Message> getLatestMessages() {
        Criteria criteria = createCriteria();
        criteria.setMaxResults(10);
        criteria.addOrder(Order.desc(Message.CREATION_DATE));

        return (List<Message>) criteria.list();
    }

    @Override
    public Message getMessageWithImages(Long messageId) {
        Message message = findById(messageId);
        message.getImages().iterator(); // lazy-load image collection
        return message;
    }
}
