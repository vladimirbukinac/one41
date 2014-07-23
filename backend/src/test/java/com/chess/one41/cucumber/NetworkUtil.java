package com.chess.one41.cucumber;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.junit.Assert.*;

public class NetworkUtil {

    public static final String baseUrl = "http://localhost:8080/rest/";

    public static String sendRequest(String targetURL, JSONObject jsonObject)
    {
        String parameters = jsonObject.toString();
        HttpURLConnection connection = null;
        try {
            //Create connection
            URL url = new URL(targetURL);
            connection = (HttpURLConnection)url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

            connection.setRequestProperty("Content-Length", "" +
                    Integer.toString(parameters.getBytes().length));

            connection.setUseCaches(false);
            connection.setDoInput(true);
            connection.setDoOutput(true);

            //Send request
            DataOutputStream wr = new DataOutputStream (
                    connection.getOutputStream ());
            wr.writeBytes (parameters);
            wr.flush();
            wr.close();

            //Get response
            if (connection.getResponseCode() != 200) {
                throw new RuntimeException("HTTP error code: " + connection.getResponseCode());
            }

            InputStream is = connection.getInputStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is));
            String line;
            StringBuffer response = new StringBuffer();
            while((line = rd.readLine()) != null) {
                response.append(line);
                response.append('\r');
            }
            rd.close();
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if(connection != null) {
                connection.disconnect();
            }
        }
    }

    public static JSONObject createJSONObject(String name, String... nameValuePairs) {
        JSONObject values = new JSONObject();
        for (int i = 0; i < nameValuePairs.length-1; i = i + 2) {
            values.put(nameValuePairs[i], nameValuePairs[i+1]);
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(name, values);

        return jsonObject;
    }

    public static void assertResponseSuccessful(String response) {
        assertTrue(response.length() == 0);
    }

    public static void assertResponseUnsuccessful(String response) {
        assertTrue(response.length() > 0);

        JSONObject jsonResponse = new JSONObject(response);
        Object error = null;

        try {
            error = jsonResponse.getJSONObject("error");
        } catch (JSONException e) {}

        assertNotNull(error);
    }
}