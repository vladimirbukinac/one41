package com.chess.one41.backend.service.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class GenericDaoImpl<E, K extends Serializable> implements GenericDao<E, K> {

	private final Class<E> persistentClass;

	@Autowired
	private SessionFactory sessionFactory;

	@SuppressWarnings("unchecked")
	public GenericDaoImpl() {
		persistentClass = (Class<E>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	}

	@Override
	public void create(E entity) {
		getCurrentSession().save(entity);
	}

	@Override
	public void update(E entity) {
		getCurrentSession().saveOrUpdate(entity);
	}

	@Override
	public void delete(E entity) {
		getCurrentSession().delete(entity);
	}

	@SuppressWarnings("unchecked")
	@Override
	public E findById(K key) {
		return (E) getCurrentSession().get(persistentClass, key);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<E> findAll() {
		return getCurrentSession().createCriteria(persistentClass).list();
	}

	protected final Session getCurrentSession() {
		return sessionFactory.getCurrentSession();
	}
	
	protected final Criteria createCriteria() {
		return getCurrentSession().createCriteria(persistentClass);
	}
}
