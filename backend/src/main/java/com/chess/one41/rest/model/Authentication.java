package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName(value = "authentication")
public class Authentication extends TokenEntity {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
