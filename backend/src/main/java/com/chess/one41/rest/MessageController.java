package com.chess.one41.rest;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.service.MessageService;
import com.chess.one41.rest.model.MessageDto;
import com.chess.one41.rest.model.TokenEntity;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/message")
@Token
public class MessageController {

    @Autowired
    MessageService messageService;

    @RequestMapping(value="/latest", method= RequestMethod.POST)
    public List<MessageDto> getLatestMessages(@RequestBody TokenEntity token) {
        List<Message> latestMessages = messageService.getLatestMessages();

        if (latestMessages == null) {
            return null;
        }

        List<MessageDto> latestMessagesDto = new ArrayList<MessageDto>();
        for(int i = 0; i < latestMessages.size(); i++){
            MessageDto messageDto = new MessageDto();
            BeanUtils.copyProperties(latestMessages.get(i) , messageDto);
            messageDto.setUserId(latestMessages.get(i).getUser().getId());
            latestMessagesDto.add(messageDto);
        }

        return latestMessagesDto;
    }

    @RequestMapping(value="/create", method= RequestMethod.POST)
    public void createMessage(@RequestBody MessageDto messageDto) {
        Message message = new Message();
        BeanUtils.copyProperties(messageDto, message);

        messageService.createEntity(message);
    }
}
