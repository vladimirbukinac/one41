package com.chess.one41.cucumber.steps;

import com.chess.one41.cucumber.NetworkUtil;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.json.JSONException;
import org.json.JSONObject;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class UserTests {

    private String response;

    @When("^I perform user authentication with correct parameters$")
    public void I_perform_user_registration_with_correct_parameters() throws Throwable {
        //String authenticateJson = "{\"authentication\":{\"username\":\"alekdov\",\"password\":\"pass\"}}";
        JSONObject authenticateJson = new JSONObject();
        JSONObject authenticateJsonValue = new JSONObject();
        authenticateJsonValue.put("username", "alekdov");
        authenticateJsonValue.put("password", "pass");
        authenticateJson.put("authentication", authenticateJsonValue);

        String url = "http://localhost:8080/rest/user/authenticate";

        response = NetworkUtil.sendRequest(url, authenticateJson.toString());
    }

    @Then("^The request should not be successful$")
    public void The_request_should_not_be_successful() throws Throwable {
        assertNotNull(response);

        JSONObject jsonResponse = new JSONObject(response);
        Object error = null;

        try {
            error = jsonResponse.getJSONObject("error");
        } catch (JSONException e) {

        }

        assertNotNull(error);
    }

    @And("^I should receive a valid token$")
    public void I_should_receive_a_valid_token() throws Throwable {
        JSONObject json = new JSONObject(response);
        final String token = json.getJSONObject("user").getString("token");
        assertNotNull(token);
        assertTrue(token.length() > 1);
    }
}
