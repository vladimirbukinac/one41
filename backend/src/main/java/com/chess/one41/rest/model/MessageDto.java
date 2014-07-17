package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.*;

import java.util.Date;
import java.util.List;

@JsonRootName(value = "message")
@JsonTypeName(value = "message")
public class MessageDto extends TokenEntity {

    private Long id;

    private Long userId;

    private String text;

    private Date creationDate;

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include= JsonTypeInfo.As.WRAPPER_OBJECT)
    private List<ImageDto> images;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public List<ImageDto> getImages() {
        return images;
    }

    public void setImages(List<ImageDto> images) {
        this.images = images;
    }
}
