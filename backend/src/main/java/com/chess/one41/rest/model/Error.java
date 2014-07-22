package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName(value = "error")
public class Error implements Response {

    public enum Type {
        TOKEN_EXPIRED,
        TOKEN_INVALID,
        SERVICE_ILLEGAL_OPERATION,
        SERVICE_EXCEPTION,
        SERVICE_INTERNAL_ERROR,
        AUTHENTICATE_INVALID_CREDENTIALS
    }

    @JsonProperty(value = "errortype")
    private final Type errorType;

    private String message;

    public Error(Type errorType) {
        this.errorType = errorType;
    }

    public Error(Type errorType, String message) {
        this(errorType);
        this.message = message;
    }

    public Type getErrorType() {
        return errorType;
    }
}
