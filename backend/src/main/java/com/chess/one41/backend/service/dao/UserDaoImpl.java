package com.chess.one41.backend.service.dao;


import com.chess.one41.backend.entity.User;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl extends GenericDaoImpl<User, Long> implements UserDao {

    @Override
    public User authenticateUser(String username, String password) {
        Criteria criteria = createCriteria();
        criteria.add(Restrictions.eq(User.USERNAME, username));
        criteria.add(Restrictions.eq(User.PASSWORD, password));

        return (User) criteria.uniqueResult();
    }

    @Override
    public User getUserByEmail(String email) {
        Criteria criteria = createCriteria();
        criteria.add(Restrictions.eq(User.EMAIL, email));

        return (User) criteria.uniqueResult();
    }

    @Override
    public User getUserByUsername(String username) {
        Criteria criteria = createCriteria();
        criteria.add(Restrictions.eq(User.USERNAME, username));

        return (User) criteria.uniqueResult();
    }
}
