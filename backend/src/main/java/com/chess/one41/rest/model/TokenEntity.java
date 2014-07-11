package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName(value = "token")
public class TokenEntity {

    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
