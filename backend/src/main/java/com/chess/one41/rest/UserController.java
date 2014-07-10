package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.UserService;
import com.chess.one41.rest.model.Authentication;
import com.chess.one41.rest.model.UserDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Token
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value="/authenticate", method= RequestMethod.POST)
    @Token(required = false)
    public UserDto authenticateUser(@RequestBody Authentication user) {
        User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
        if (authenticatedUser == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(authenticatedUser, userDto);
        userDto.setToken(SessionUtil.createUserSession(authenticatedUser));

        return userDto;
    }

    // The @Token annotation on the class level is applied to this method!
    // This method is here for testing purposes only
    @RequestMapping(value="/authenticate/session", method= RequestMethod.POST)
    public UserDto authenticateUserWithSession(@RequestBody Authentication user) {
        User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
        if (authenticatedUser == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(authenticatedUser, userDto);
        userDto.setToken(SessionUtil.createUserSession(authenticatedUser));

        return userDto;
    }
}
