Feature: User operations (create & authenticate, create with duplicate email, invalid credentials)

  Scenario: Create new user
    When I create a new user with username "user1"
    Then I should be able to login with username "user1"
    And I should receive a valid token for "user1"

  Scenario: Try to create user with duplicate email
    Given I create a new user with username "user2"
    Then I cannot create another user with the same email as "user2"

  Scenario: Invalid credentials
    When I create a new user with username "user3"
    Then I cannot authenticate with "user3" using an incorrect password