package com.chess.one41.cucumber.steps;

import com.chess.one41.cucumber.NetworkUtil;
import com.chess.one41.rest.model.Authentication;
import com.chess.one41.rest.model.MessageDto;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.json.JSONObject;

import static org.junit.Assert.*;

/**
 * Created by ggloncak on 7/29/2014.
 */
public class NewPostTests {


    private String token;
    private Long messageId;

    @Given("^I should be able to login with username and keep token \"([^\"]*)\"$")
    public void I_should_be_able_to_login_as_a_new_user(String username) throws Throwable {
        Authentication authentication = new Authentication();
        authentication.setUsername(username);
        authentication.setPassword(username + "_pass");

        String jsonString = NetworkUtil.generateJSONString(authentication);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "user/authenticate", jsonString);

        JSONObject jsonResponse = new JSONObject(response);
        assertNotNull(jsonResponse.getJSONObject("user"));
        assertEquals(jsonResponse.getJSONObject("user").get("username"), username);
        token = jsonResponse.getJSONObject("user").getString("token");
    }

    @Then("^I should be able to post a new message with text \"([^\"]*)\"$")
    public void I_should_be_able_to_post_a_new_message(String text) throws Throwable {

        MessageDto messageDto = new MessageDto();
        messageDto.setText(text);

        String jsonString = NetworkUtil.generateJSONString(messageDto, token);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "message/create", jsonString);

        JSONObject jsonResponse = new JSONObject(response);
        assertNotNull(jsonResponse.getJSONObject("message"));
        assertEquals(jsonResponse.getJSONObject("message").get("text"), messageDto.getText());
        messageId = jsonResponse.getJSONObject("message").getLong("id");
    }

    @Then("^I should be able to fetch the previous message")
    public void I_should_be_able_to_fetch_the_previous_message() throws Throwable {

        MessageDto messageDto = new MessageDto();

        messageDto.setId(messageId);

        String jsonString = NetworkUtil.generateJSONString(messageDto, token);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "message/get", jsonString);

        JSONObject jsonResponse = new JSONObject(response);
        assertNotNull(jsonResponse.getJSONObject("message"));
        assertEquals(jsonResponse.getJSONObject("message").getLong("id"), messageDto.getId().longValue());
    }

    @Then("^I should be able to delete the previous message")
    public void I_should_be_able_to_delete_the_previous_message() throws Throwable {

        MessageDto messageDto = new MessageDto();

        messageDto.setId(messageId);

        String jsonString = NetworkUtil.generateJSONString(messageDto, token);
        String response = NetworkUtil.sendRequest(NetworkUtil.baseUrl + "message/delete", jsonString);

        //JSONObject jsonResponse = new JSONObject(response);
        assertTrue(response.isEmpty());
    }
}
