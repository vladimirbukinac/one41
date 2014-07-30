package com.chess.one41.backend.service.dao;

import com.chess.one41.backend.entity.Message;

import java.util.List;

public interface MessageDao extends GenericDao<Message, Long> {

    List<Message> getLatestMessages();

    List<Message> getLatestMessagesAfterTime(Long dateTime);

    Message getMessageWithImages(Long messageId);
}
