package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName(value = "message")
public class MessageDto extends TokenEntity {

    private Long id;

    private Long userId;

    private String text;

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
}
