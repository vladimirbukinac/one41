Feature: New Message operations ()

  Scenario: Create message with existing user
    Given I should be able to login with username and keep token "userNm"
    When I should be able to post a new message with text "message contents"
    Then I should be able to fetch the previous message

  Scenario: Create and delete message with existing user
    Given I should be able to login with username and keep token "userNm"
    When I should be able to post a new message with text "message contents"
    Then I should be able to fetch the previous message
    And I should be able to delete the previous message
