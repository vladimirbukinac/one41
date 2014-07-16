package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName(value = "error")
public class Error implements Response {

    public enum Type {
        TOKEN_EXPIRED,
        TOKEN_INVALID,
        INVALID_OPERATION
    }

    @JsonProperty(value = "errortype")
    private final Type errorType;

    public Error(Type errorType) {
        this.errorType = errorType;
    }

    public Type getErrorType() {
        return errorType;
    }
}
