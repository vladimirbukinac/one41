package com.chess.one41.backend.service;

import com.chess.one41.backend.entity.Message;

import java.util.List;

public interface MessageService extends GenericService<Message, Long> {

    List<Message> getLatestMessages();
}
