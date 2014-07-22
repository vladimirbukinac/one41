Feature: User operations (create, authenticate, create with duplicate email)

  Scenario: Create new user
    When I create a new user
    Then The request should be successful

  Scenario: Authenticate with new user
    Given New user was successfully create in previous scenario
    When I perform user authentication
    Then The request should return the user info
    And I should receive a valid token

  Scenario: Try to create a new user with duplicate email
    When I try to create a new user with duplicate email
    Then The request should not be successful

  Scenario: Authenticate with invalid credentials
    When I try to authenticate with invalid credentials
    Then The request should not be successful
    And