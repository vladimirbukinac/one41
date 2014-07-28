package com.chess.one41.rest.controller;

import com.chess.one41.backend.entity.Image;
import com.chess.one41.backend.entity.Message;
import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.MessageService;
import com.chess.one41.backend.service.exception.EntityNotFoundException;
import com.chess.one41.backend.service.exception.ServiceException;
import com.chess.one41.rest.Session;
import com.chess.one41.rest.Token;
import com.chess.one41.rest.model.ImageDto;
import com.chess.one41.rest.model.MessageDto;
import com.chess.one41.rest.model.Response;
import com.chess.one41.rest.model.TokenEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.beans.PropertyEditorSupport;
import java.io.IOException;
import java.util.ArrayList;
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
            MessageDto messageDto = new MessageDto();
            BeanUtils.copyProperties(latestMessages.get(i) , messageDto);
            messageDto.setUserId(latestMessages.get(i).getUser().getId());
            messageDto.setImages(new ArrayList<ImageDto>());
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
            for (ImageDto imageDto : messageDto.getImages()) {
                Image image = new Image();
                BeanUtils.copyProperties(imageDto, image);
                image.setMessage(message);
                images.add(image);

            }
        }

        message.setImages(images);

        message.setUserId(session.getLoggedInUser(messageDto.getToken()).getId());

        messageService.createEntity(message);

        return null;
    }
    @RequestMapping(value="/createWithAttachment", method= {RequestMethod.POST})
    //public Response createMessageMultipartTest(@ModelAttribute MessageDto message, @RequestParam(value = "file", required = false) MultipartFile file) throws EntityNotFoundException {
    //public Response createMessageMultipartTest(@RequestParam(value = "message", required = false) MessageDto message) throws EntityNotFoundException {
    public Response createMessageMultipartTest(@RequestParam(value = "message", required = false) MessageDto messageDto, @RequestParam(value = "file", required = false) List<MultipartFile> file ) throws EntityNotFoundException {

        Message message = new Message();
        BeanUtils.copyProperties(messageDto, message);

        List<Image> images = new ArrayList<Image>();
        if (file != null) {
            for (MultipartFile multipartFile : file) {
                Image image = new Image();
                image.setName(multipartFile.getName());
                try {
                    image.setImage(multipartFile.getBytes());
                } catch (IOException e) {
                    log.error("Missing Multipart file in request for image: " + multipartFile.getName());
                }

                image.setMessage(message);
                images.add(image);
            }


        }
        message.setImages(images);

        message.setUserId(session.getLoggedInUser(messageDto.getToken()).getId());

        messageService.createEntity(message);

        return null;
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

   /* @InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder)
            throws ServletException {

        // Convert multipart object to byte[]
        binder.registerCustomEditor(byte[].class, new ByteArrayMultipartFileEditor());
       // log.error("Init binder doing it's stuff");
    }*/

    @Token(required = false)
    @InitBinder
    public void initBinder(WebDataBinder dataBinder) {

        // this custom editor handles MEssageDto as request parameter when used like <code> @RequestParam(value = "message", required = false) MessageDto messageDto </code>
        dataBinder.registerCustomEditor(MessageDto.class, new PropertyEditorSupport() {
            Object value;
            @Override
            public Object getValue() {
                return value;
            }

            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    MessageDto message = mapper.readValue(text, MessageDto.class);
                    value = message;
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        });


    }
}
