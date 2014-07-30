package com.chess.one41.backend.service;

import java.util.List;

public interface GenericService<E, K> {

	void createEntity(E entity);
	
	void updateEntity(E entity);
	
	void deleteEntity(E entity);
	
	E findEntity(K key);

	List<E> getEntities();
}
