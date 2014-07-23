package com.chess.one41.rest.controller;

import com.chess.one41.backend.service.exception.IllegalOperationException;
import com.chess.one41.backend.service.exception.ServiceException;
import com.chess.one41.rest.model.Error;
import com.chess.one41.rest.model.ErrorWrapper;
import org.apache.log4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Methods of this class handle exceptions thrown from all registered controllers.
 */
@ControllerAdvice
public class ControllerExceptionHandler {

    Logger log = Logger.getLogger(ControllerExceptionHandler.class);

    @ExceptionHandler(ServiceException.class)
    public HttpEntity<ErrorWrapper> exception(ServiceException e) {
        log.error(e);
        HttpEntity<ErrorWrapper> response = new HttpEntity<ErrorWrapper>(new ErrorWrapper(new Error(Error.Type.SERVICE_EXCEPTION)));
        return response;
    }

    @ExceptionHandler(IllegalOperationException.class)
    public HttpEntity<ErrorWrapper> exception(IllegalOperationException e) {
        log.warn(e);
        HttpEntity<ErrorWrapper> response = new HttpEntity<ErrorWrapper>(new ErrorWrapper(new Error(Error.Type.SERVICE_ILLEGAL_OPERATION)));
        return response;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public HttpEntity<ErrorWrapper> exception(HttpMessageNotReadableException e) {
        log.warn(e);
        HttpEntity<ErrorWrapper> response = new HttpEntity<ErrorWrapper>(new ErrorWrapper(new Error(Error.Type.REQUEST_INVALID)));
        return response;
    }

    @ExceptionHandler(RuntimeException.class)
    public HttpEntity<ErrorWrapper> exception(RuntimeException e) {
        log.error(e);
        HttpEntity<ErrorWrapper> response = new HttpEntity<ErrorWrapper>(new ErrorWrapper(new Error(Error.Type.SERVICE_INTERNAL_ERROR)));
        return response;
    }
}
