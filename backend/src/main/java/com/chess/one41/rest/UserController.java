package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.UserService;
import com.chess.one41.rest.model.Authentication;
import com.chess.one41.rest.model.Response;
import com.chess.one41.rest.model.UserDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value="/authenticate", method= {RequestMethod.GET, RequestMethod.POST})
    public Response authenticateUser(@RequestBody Authentication user) {
        User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
        if (authenticatedUser == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(authenticatedUser, userDto);
        userDto.setToken(SessionUtil.createUserSession(authenticatedUser));

        return new ResponseWrapper(userDto);
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
