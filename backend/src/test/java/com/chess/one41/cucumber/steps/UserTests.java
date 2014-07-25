package com.chess.one41.cucumber.steps;

import com.chess.one41.cucumber.NetworkUtil;
import com.chess.one41.rest.model.Authentication;
import com.chess.one41.rest.model.UserDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.json.JSONObject;

import static org.junit.Assert.*;

public class UserTests {

    @When("^I create a new user with username \"([^\"]*)\"$")
    public void I_create_a_new_user(String username) throws Throwable {
        UserDtoWithPassword userDto = new UserDtoWithPassword();
        userDto.setUsername(username);
        userDto.setEmail(username + "@email.com");
        userDto.setPassword(username + "_pass");

        String jsonString = NetworkUtil.generateJSONString(userDto);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/create", jsonString);

        NetworkUtil.assertResponseSuccessful(response);
    }

    @Then("^I should be able to login with username \"([^\"]*)\"$")
    public void I_should_be_able_to_login_as_a_new_user(String username) throws Throwable {
        Authentication authentication = new Authentication();
        authentication.setUsername(username);
        authentication.setPassword(username + "_pass");

        String jsonString = NetworkUtil.generateJSONString(authentication);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/authenticate", jsonString);

        JSONObject jsonResponse = new JSONObject(response);
        assertNotNull(jsonResponse.getJSONObject("user"));
        assertEquals(jsonResponse.getJSONObject("user").get("username"), username);
    }

    @And("^I should receive a valid token for \"([^\"]*)\"$")
    public void I_should_receive_a_valid_token(String username) throws Throwable {
        Authentication authentication = new Authentication();
        authentication.setUsername(username);
        authentication.setPassword(username + "_pass");

        String jsonString = NetworkUtil.generateJSONString(authentication);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/authenticate", jsonString);

        JSONObject jsonResponse = new JSONObject(response);
        assertNotNull(jsonResponse.getJSONObject("user"));
        String token = jsonResponse.getJSONObject("user").getString("token");

        assertNotNull(token);
        assertTrue(token.length() == 36);
    }

    @Then("^I cannot create another user with the same email as \"([^\"]*)\"$")
    public void I_cannot_create_another_user_with_the_same_email(String username) {
        UserDtoWithPassword userDto = new UserDtoWithPassword();
        userDto.setUsername(username);
        userDto.setPassword(username + "_pass");
        userDto.setEmail(username + "@email.com");

        String jsonString = NetworkUtil.generateJSONString(userDto);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/create", jsonString);

        NetworkUtil.assertResponseUnsuccessful(response);
    }

    @Then("^I cannot authenticate with \"([^\"]*)\" using an incorrect password$")
    public void I_cannot_authenticate_using_an_incorrect_password(String username) {
        Authentication authentication = new Authentication();
        authentication.setUsername(username);
        authentication.setPassword("wrong_pass");

        String jsonString = NetworkUtil.generateJSONString(authentication);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/authenticate", jsonString);

        NetworkUtil.assertResponseUnsuccessful(response);
    }

    /**
     * Extend UserDto class so that the password can be returned in order to construct proper JSON string.
     */
    private static class UserDtoWithPassword extends UserDto {
        @JsonIgnore(value = false)
        public String getPassword() {
            return super.getPassword();
        }
    }

}
