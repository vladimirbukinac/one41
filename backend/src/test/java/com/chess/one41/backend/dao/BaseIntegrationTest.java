package com.chess.one41.backend.dao;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "/META-INF/applicationContext-test.xml")
@Transactional
abstract class BaseIntegrationTest {
}
