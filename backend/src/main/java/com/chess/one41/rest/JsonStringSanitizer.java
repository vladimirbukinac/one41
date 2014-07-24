package com.chess.one41.rest;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.deser.std.StringDeserializer;
import org.apache.commons.validator.routines.EmailValidator;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Extend Jackson's JSON String deserializer to sanitize value after deserialization
 */
@Component
public class JsonStringSanitizer extends JsonDeserializer<String> {

    @Override
    public String deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        final String value = StringDeserializer.instance.deserialize(jp, ctxt);

        // Skip sanitization of a valid email
        if(EmailValidator.getInstance().isValid(value)) {
            return value;
        }

        PolicyFactory policy = Sanitizers.FORMATTING.and(Sanitizers.LINKS);
        return policy.sanitize(value);
    }
}
