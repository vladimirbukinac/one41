package com.chess.one41.cucumber.steps;

import com.chess.one41.cucumber.NetworkUtil;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.json.JSONObject;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class UserTests {

    @When("^I create a new user$")
    public void I_create_a_new_user() throws Throwable {
        JSONObject jsonObject = NetworkUtil.createJSONObject("user", "username", "test1", "password", "pass1", "email", "test1@email.com", "firstName", "John", "lastName", "Doe");
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/create", jsonObject);
        NetworkUtil.assertResponseSuccessful(response);
    }

    @Then("^I should be able to login as a new user$")
    public void I_should_be_able_to_login_as_a_new_user() throws Throwable {
        JSONObject jsonObject = NetworkUtil.createJSONObject("authentication", "username", "test1", "password", "pass1");
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/authenticate", jsonObject);

        JSONObject jsonResponse = new JSONObject(response);
        assertNotNull(jsonResponse.getJSONObject("user"));
    }

    @And("^I should receive a valid token$")
    public void I_should_receive_a_valid_token() throws Throwable {
        JSONObject jsonObject = NetworkUtil.createJSONObject("authentication", "username", "test1", "password", "pass1");
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/authenticate", jsonObject);

        JSONObject jsonResponse = new JSONObject(response);
        String token = jsonResponse.getJSONObject("user").getString("token");

        assertNotNull(token);
        assertTrue(token.length() > 1);
    }
}
