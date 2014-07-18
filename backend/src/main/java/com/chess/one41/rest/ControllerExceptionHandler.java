package com.chess.one41.rest;

import com.chess.one41.backend.service.exception.IllegalOperationException;
import com.chess.one41.backend.service.exception.ServiceException;
import com.chess.one41.rest.model.Error;
import com.chess.one41.rest.model.ErrorWrapper;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(ServiceException.class)
    public HttpEntity<ErrorWrapper> exception(ServiceException e) {
        HttpEntity<ErrorWrapper> response = new HttpEntity<ErrorWrapper>(new ErrorWrapper(new Error(Error.Type.SERVICE_EXCEPTION)));
        return response;
    }

    @ExceptionHandler(IllegalOperationException.class)
    public HttpEntity<ErrorWrapper> exception(IllegalOperationException e) {
        HttpEntity<ErrorWrapper> response = new HttpEntity<ErrorWrapper>(new ErrorWrapper(new Error(Error.Type.SERVICE_ILLEGAL_OPERATION)));
        return response;
    }
}
