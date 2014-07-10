package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class SessionUtil {

    private static Map<String, SessionInfo> session = new ConcurrentHashMap<String, SessionInfo>();
    private static final int timeout = 60; // in seconds

    public static boolean isUserLoggedIn(String token) {
        if (token == null) {
            return false;
        }

        SessionInfo sessionInfo = session.get(token);

        if (sessionInfo == null) {
            return false;
        }
        if (sessionInfo.isExpired()) {
            session.remove(token);
            return false;
        }

        return true;
    }

    public static String createUserSession(User user) {
        SessionInfo sessionInfo = new SessionInfo(user, timeout);
        String sessionToken = generateToken();
        session.put(sessionToken, sessionInfo);

        return sessionToken;
    }

    private static String generateToken() {
        return UUID.randomUUID().toString();
    }
}
