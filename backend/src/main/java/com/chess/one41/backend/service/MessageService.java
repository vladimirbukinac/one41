package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.service.exception.EntityNotFoundException;
import com.chess.one41.backend.service.exception.IllegalOperationException;

import java.util.List;

public interface MessageService extends GenericService<Message, Long> {

    List<Message> getLatestMessages();

    Message getMessageWithImages(Long messageId);

    void deleteMessage(Long messageId, Long userId) throws EntityNotFoundException, IllegalOperationException;
}
