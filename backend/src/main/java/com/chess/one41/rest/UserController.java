package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;
import com.chess.one41.backend.service.UserService;
import com.chess.one41.rest.model.Authentication;
import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value="/authenticate", method= RequestMethod.POST)
    public User authenticateUser(@RequestBody Authentication user) {
        return userService.authenticateUser(user.getUsername(), user.getPassword());
    }
}
