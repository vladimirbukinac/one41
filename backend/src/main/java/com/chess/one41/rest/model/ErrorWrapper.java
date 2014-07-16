package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ErrorWrapper implements Response {

    @JsonProperty(value = "error")
    private final Error error;

    public ErrorWrapper(Error error) {
        this.error = error;
    }
}
