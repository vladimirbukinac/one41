package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.UserService;
import com.chess.one41.backend.service.exception.IllegalOperationException;
import com.chess.one41.rest.model.*;
import com.chess.one41.rest.model.Error;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Token
@RestController
@RequestMapping("/rest/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Token(required = false)
    @RequestMapping(value="/authenticate", method= {RequestMethod.GET, RequestMethod.POST})
    public Response authenticateUser(@RequestBody Authentication user) {
        User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
        if (authenticatedUser == null) {
            return new ErrorWrapper(new Error(Error.Type.AUTHENTICATE_INVALID_CREDENTIALS));
        }

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(authenticatedUser, userDto);
        userDto.setToken(SessionUtil.createUserSession(authenticatedUser));

        return new ResponseWrapper(userDto);
    }

    @Token(required = false)
    @RequestMapping(value="/create", method= {RequestMethod.GET, RequestMethod.POST})
    public Response createUser(@RequestBody UserDto userDto) throws IllegalOperationException {
        User user = new User();
        BeanUtils.copyProperties(userDto, user);

        userService.createOrUpdateUser(user);

        return null;
    }

    @RequestMapping(value="/update", method= {RequestMethod.GET, RequestMethod.POST})
    public Response updateUser(@RequestBody UserDto userDto) throws IllegalOperationException {
        User user = new User();
        BeanUtils.copyProperties(userDto, user);

        userService.createOrUpdateUser(user);

        return null;
    }

    // Wrapper class for generating wanted JSON output format
    private static class ResponseWrapper implements Response {
        @JsonProperty("user")
        private final UserDto userDto;

        public ResponseWrapper(UserDto userDto) {
            this.userDto = userDto;
        }
    }
}
