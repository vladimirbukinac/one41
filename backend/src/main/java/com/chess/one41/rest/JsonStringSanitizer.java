package com.chess.one41.rest;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.deser.std.StringDeserializer;
import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

import java.io.IOException;

/**
 * Extend Jackson's JSON String deserializer to sanitize value after deserialization
 */
@Component
public class JsonStringSanitizer extends JsonDeserializer<String> {

    @Override
    public String deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        return HtmlUtils.htmlEscape(StringDeserializer.instance.deserialize(jp, ctxt));
    }
}
