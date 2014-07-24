package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class Session {

    private Map<String, SessionInfo> sessions = new ConcurrentHashMap<String, SessionInfo>();

    private int timeout = 15 * 60; // in minutes

    public boolean isUserLoggedIn(String token) {
        if (token == null) {
            return false;
        }

        SessionInfo sessionInfo = sessions.get(token);

        if (sessionInfo == null) {
            return false;
        }
        if (sessionInfo.isExpired()) {
            sessions.remove(token);
            return false;
        }

        return true;
    }

    public String createUserSession(User user) {
        SessionInfo sessionInfo = new SessionInfo(user, timeout);
        String sessionToken = generateToken();
        sessions.put(sessionToken, sessionInfo);

        return sessionToken;
    }

    public User getLoggedInUser(String token) {
        return sessions.get(token).getUser();
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    @Scheduled(fixedDelay = 60000)
    private void removeExpiredSessions() {
        Set<String> tokens = sessions.keySet();
        for (String token : tokens) {
            SessionInfo sessionInfo = sessions.get(token);
            if (sessionInfo != null && sessionInfo.isExpired(false)) {
                sessions.remove(token);
            }
        }
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
}
