package com.chess.one41.backend.service;

import com.chess.one41.backend.service.dao.GenericDao;
import com.chess.one41.backend.service.exception.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public abstract class GenericServiceImpl<E, K> implements GenericService<E, K> {

	protected abstract GenericDao<E, K> getDao();
	
	@Override
	public void createEntity(E entity) throws EntityNotFoundException {
		getDao().create(entity);
	}

	@Override
	public void updateEntity(E entity) {
		getDao().update(entity);
	}

	@Override
	public void deleteEntity(E entity) {
		getDao().delete(entity);
	}

	@Transactional(readOnly = true)
	@Override
	public E getEntity(K key) throws EntityNotFoundException {
		E entity = getDao().findById(key);
        if (entity == null) {
            throw new EntityNotFoundException();
        }

        return entity;
	}

	@Transactional(readOnly = true)
	@Override
	public List<E> getEntities() {
		return getDao().findAll();
	}
}
