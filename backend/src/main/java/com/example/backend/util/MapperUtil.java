package com.example.backend.util;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MapperUtil {
    private final ModelMapper mapper = new ModelMapper();

    public <T> T map(Object src, Class<T> clazz) {
        return mapper.map(src, clazz);
    }
}
