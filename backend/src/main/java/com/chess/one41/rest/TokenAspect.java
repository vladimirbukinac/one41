package com.chess.one41.rest;

import com.chess.one41.rest.model.TokenEntity;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Component
@Aspect
public class TokenAspect {
    @Around(value = "@within(com.chess.one41.rest.Token) || @annotation(com.chess.one41.rest.Token)")
    public Object validateToken(ProceedingJoinPoint pjp) throws Throwable {
        if(isTokenRequired(pjp)) {
            if(SessionUtil.isUserLoggedIn(findToken(pjp))) {
                return pjp.proceed();
            } else {
                return null;
            }
        }
        return pjp.proceed();
    }

    private boolean isTokenRequired(ProceedingJoinPoint pjp) {
        // Try finding the method annotation first
        MethodSignature ms = (MethodSignature) pjp.getSignature();
        Method m = ms.getMethod();
        Token methodAnnotation = m.getAnnotation(Token.class);
        if (methodAnnotation != null) {
            return methodAnnotation.required();
        }

        // No method annotation found, try finding the class annotation
        Token classAnnotation = pjp.getTarget().getClass().getAnnotation(Token.class);
        if (classAnnotation != null) {
            return classAnnotation.required();
        }

        return false;
    }

    private String findToken(ProceedingJoinPoint pjp) {
        Object[] objects = pjp.getArgs();
        for(Object object : objects) {
            if (object instanceof TokenEntity) {
                return ((TokenEntity)object).getToken();
            }
        }
        return null;
    }
}