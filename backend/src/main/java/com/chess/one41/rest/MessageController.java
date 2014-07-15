package com.chess.one41.rest;

import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.service.MessageService;
import com.chess.one41.rest.model.MessageDto;
import com.chess.one41.rest.model.TokenEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/rest/message")
@Token
public class MessageController {

    @Autowired
    MessageService messageService;

    @RequestMapping(value="/latest", method= {RequestMethod.GET, RequestMethod.POST})
    public ResponseListWrapper getLatestMessages(@RequestBody TokenEntity token) {
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

        return new ResponseListWrapper(latestMessagesDto);
    }

    @RequestMapping(value="/create", method= {RequestMethod.GET, RequestMethod.POST})
    public void createMessage(@RequestBody MessageDto messageDto) {
        Message message = new Message();
        BeanUtils.copyProperties(messageDto, message);

        messageService.createEntity(message);
    }

    @RequestMapping(value="/get", method= {RequestMethod.GET, RequestMethod.POST})
    @Token(required = false)
    public ResponseWrapper getMessage() {
        Message message = messageService.getEntity(1L);
        MessageDto messageDto = new MessageDto();

        BeanUtils.copyProperties(message, messageDto);
        return new ResponseWrapper(messageDto);
    }


    // Wrapper classes for generating wanted JSON output format
    private static class ResponseWrapper {
        @JsonProperty(value = "message")
        private final MessageDto messageDto;

        public ResponseWrapper(MessageDto messageDto) {
            this.messageDto = messageDto;
        }
    }

    private static class ResponseListWrapper {
        @JsonProperty(value = "messages")
        @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include= JsonTypeInfo.As.WRAPPER_OBJECT)
        private final List<MessageDto> messageDto;

        public ResponseListWrapper(List<MessageDto> messageDto) {
            this.messageDto = messageDto;
        }
    }
}
