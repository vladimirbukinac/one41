package com.chess.one41.backend.service;

import com.chess.one41.backend.service.exception.EntityNotFoundException;

import java.util.List;

public interface GenericService<E, K> {

	void createEntity(E entity) throws EntityNotFoundException;
	
	void updateEntity(E entity);
	
	void deleteEntity(E entity);
	
	E getEntity(K key) throws EntityNotFoundException;

	List<E> getEntities();
}
