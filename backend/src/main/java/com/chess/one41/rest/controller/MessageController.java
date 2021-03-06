package com.chess.one41.rest.controller;

import com.chess.one41.backend.entity.Image;
import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.MessageService;
import com.chess.one41.backend.service.exception.EntityNotFoundException;
import com.chess.one41.backend.service.exception.ServiceException;
import com.chess.one41.rest.Session;
import com.chess.one41.rest.Token;
import com.chess.one41.rest.model.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Token
@RestController
@RequestMapping("/rest/message")
public class MessageController {

    Logger log = Logger.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @Autowired
    private Session session;

    @RequestMapping(value="/latest", method= {RequestMethod.GET, RequestMethod.POST})
    public Response getLatestMessages(@RequestBody TokenEntity token) {
        List<Message> latestMessages = messageService.getLatestMessages();

        if (latestMessages == null) {
            return null;
        }

        List<MessageDto> latestMessagesDto = new ArrayList<MessageDto>();
        for(int i = 0; i < latestMessages.size(); i++){
            Message message = latestMessages.get(i);
            MessageDto messageDto = getMessageDto(message);
            latestMessagesDto.add(messageDto);
        }

        return new ResponseListWrapper(latestMessagesDto);
    }

    private MessageDto getMessageDto(Message message) {
        MessageDto messageDto = new MessageDto();
        BeanUtils.copyProperties(message, messageDto);
        messageDto.setUserId(message.getUser().getId());
        messageDto.setImages(new ArrayList<ImageDto>());
        return messageDto;
    }

    @RequestMapping(value="/latest-after-time", method= {RequestMethod.GET, RequestMethod.POST})
    public Response getMessagesAfterTime(@RequestBody LatestAfterTimeDto latestAfterTimeDto) {
        List<Message> latestMessages = messageService.getLatestMessagesAfterTime(latestAfterTimeDto.getDateTime());

        if (latestMessages == null) {
            return null;
        }

        List<MessageDto> latestMessagesDto = new ArrayList<MessageDto>();
        for(int i = 0; i < latestMessages.size(); i++){
            Message message = latestMessages.get(i);
            MessageDto messageDto = getMessageDto(message);
            latestMessagesDto.add(messageDto);
        }

        return new ResponseListWrapper(latestMessagesDto);
    }

    @RequestMapping(value="/create", method= {RequestMethod.GET, RequestMethod.POST})
    public Response createMessage(@RequestBody MessageDto messageDto) throws EntityNotFoundException {
        Message message = new Message();
        BeanUtils.copyProperties(messageDto, message);

        List<Image> images = new ArrayList<Image>();
        if (messageDto.getImages() != null) {
            for (int i = 0; i < messageDto.getImages().size(); i++) {
                if (i > 10){
                    log.warn("Image count limit (10) exceeded for file list of size: " + messageDto.getImages().size());
                    break;
                }
                ImageDto imageDto = messageDto.getImages().get(i);
                if (imageDto.getImage().length < 9000000) {
                    Image image = new Image();
                    BeanUtils.copyProperties(imageDto, image);
                    image.setMessage(message);
                    images.add(image);
                } else {
                    log.warn("Image size limit exceeded for file: " + imageDto.getName());
                    // TODO what to do here? exception?
                }
            }
        }
        message.setImages(images);

        message.setUserId(session.getLoggedInUser(messageDto.getToken()).getId());

        messageService.createEntity(message);

        return new ResponseWrapper(getMessageDto(message));
    }

    @RequestMapping(value="/delete", method= {RequestMethod.GET, RequestMethod.POST})
    public Response deleteMessage(@RequestBody MessageDto messageDto) throws ServiceException {
        User user = session.getLoggedInUser(messageDto.getToken());
        messageService.deleteMessage(messageDto.getId(), user.getId());

        return null;
    }

    @RequestMapping(value="/get",  method= {RequestMethod.GET, RequestMethod.POST})
    public Response getMessageWithImages(@RequestBody MessageDto messageDto) throws EntityNotFoundException {
        Message message = messageService.getMessageWithImages(messageDto.getId());
        BeanUtils.copyProperties(message, messageDto);

        List<ImageDto> imagesDto = new ArrayList<ImageDto>();
        for (Image image : message.getImages()) {
            ImageDto imageDto = new ImageDto();
            BeanUtils.copyProperties(image, imageDto);
            imagesDto.add(imageDto);
        }
        messageDto.setImages(imagesDto);

        return new ResponseWrapper(messageDto);
    }


    // Wrapper classes for generating wanted JSON output format
    private static class ResponseWrapper implements Response {
        @JsonProperty(value = "message")
        private final MessageDto messageDto;

        public ResponseWrapper(MessageDto messageDto) {
            this.messageDto = messageDto;
        }
    }

    private static class ResponseListWrapper implements Response {
        @JsonProperty(value = "messages")
        @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include= JsonTypeInfo.As.WRAPPER_OBJECT)
        private final List<MessageDto> messageDto;

        public ResponseListWrapper(List<MessageDto> messageDto) {
            this.messageDto = messageDto;
        }
    }
}
