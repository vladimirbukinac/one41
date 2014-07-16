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

    @JsonProperty(value = "additionalmessage")
    private final String additionalMessage;

    public Error(Type errorType, String additionalMessage) {
        this.errorType = errorType;
        this.additionalMessage = additionalMessage;
    }

    public Type getErrorType() {
        return errorType;
    }

    public String getAdditionalMessage() {
        return additionalMessage;
    }
}
