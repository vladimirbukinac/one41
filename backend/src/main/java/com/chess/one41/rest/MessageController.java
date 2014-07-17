package com.chess.one41.rest;

import com.chess.one41.backend.entity.Image;
import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.MessageService;
import com.chess.one41.rest.model.Error;
import com.chess.one41.rest.model.*;
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
    public Response getLatestMessages(@RequestBody TokenEntity token) {
        List<Message> latestMessages = messageService.getLatestMessages();

        if (latestMessages == null) {
            return null;
        }

        List<MessageDto> latestMessagesDto = new ArrayList<MessageDto>();
        for(int i = 0; i < latestMessages.size(); i++){
            MessageDto messageDto = new MessageDto();
            BeanUtils.copyProperties(latestMessages.get(i) , messageDto);
            messageDto.setUserId(latestMessages.get(i).getUser().getId());
            messageDto.setImages(new ArrayList<ImageDto>());
            latestMessagesDto.add(messageDto);
        }

        return new ResponseListWrapper(latestMessagesDto);
    }

    @RequestMapping(value="/create", method= {RequestMethod.GET, RequestMethod.POST})
    public void createMessage(@RequestBody MessageDto messageDto) {
        Message message = new Message();
        BeanUtils.copyProperties(messageDto, message);

        List<Image> images = new ArrayList<Image>();
        for (ImageDto imageDto : messageDto.getImages()) {
            Image image = new Image();
            BeanUtils.copyProperties(imageDto, image);
            image.setMessage(message);
            images.add(image);
        }
        message.setImages(images);

        message.setUserId(SessionUtil.getLoggedInUser(messageDto.getToken()).getId());

        messageService.createEntity(message);
    }

    @RequestMapping(value="/delete", method= {RequestMethod.GET, RequestMethod.POST})
    public Response deleteMessage(@RequestBody MessageDto messageDto) {
        Message message = messageService.getEntity(messageDto.getId());
        User user = SessionUtil.getLoggedInUser(messageDto.getToken());

        if (message == null || !message.getUser().getId().equals(user.getId())) {
            return new ErrorWrapper(new Error(Error.Type.INVALID_OPERATION));
        }

        messageService.deleteEntity(message);

        return null;
    }

    @RequestMapping(value="/get",  method= {RequestMethod.GET, RequestMethod.POST})
    public Response getMessageWithImages(@RequestBody MessageDto messageDto) {
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
