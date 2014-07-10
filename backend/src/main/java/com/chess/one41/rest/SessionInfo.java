package com.chess.one41.rest;

import com.chess.one41.backend.entity.User;

import java.util.Date;

public class SessionInfo {

    private final User user;
    private final int timeout;
    private volatile Date lastAccess = new Date();

    public SessionInfo(User user, int timeout) {
        this.user = user;
        this.timeout = timeout;
    }

    public boolean isExpired() {
        Date now = new Date();
        boolean expired = (now.getTime() - lastAccess.getTime()) / 1000 > timeout;

        if (!expired) {
            lastAccess = now;
        }

        return expired;
    }
}
