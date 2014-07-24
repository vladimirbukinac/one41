Feature: User operations (create & authenticate, create with duplicate email, invalid credentials)

  Scenario: Create new user
    When I create a new user
    Then I should be able to login as a new user
    And I should receive a valid token
