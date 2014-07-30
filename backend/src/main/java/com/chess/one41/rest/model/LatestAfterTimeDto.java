package com.chess.one41.rest.model;

import com.fasterxml.jackson.annotation.*;

@JsonRootName(value = "latestAfter")
@JsonTypeName(value = "dateTime")
public class LatestAfterTimeDto extends TokenEntity {

    private Long dateTime;

    public Long getDateTime() {
        return dateTime;
    }

    public void setDateTime(Long dateTime) {
        this.dateTime = dateTime;
    }
}
