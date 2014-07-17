package com.chess.one41.backend.entity;

import javax.persistence.*;

@Entity
public class Image {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Lob
    private byte[] image;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Message message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }
}
