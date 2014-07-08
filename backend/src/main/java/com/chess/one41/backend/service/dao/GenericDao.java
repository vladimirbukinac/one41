package com.chess.one41.backend.service.dao;

import java.util.List;

public interface GenericDao<E, K> {

	void create(E entity);
	
	void update(E entity);
	
	void delete(E entity);
	
	E findById(K key);
	
	List<E> findAll();
}
