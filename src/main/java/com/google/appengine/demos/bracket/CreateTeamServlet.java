package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.Set;

import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CreateTeamServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        String tournamentName = req.getParameter("tournamentName");
        Key tournamentKey = KeyFactory.createKey("Tournament", tournamentName);
        String content = req.getParameter("content");
        Date date = new Date();
        Entity team = new Entity("Team", tournamentKey);
        team.setProperty("user", user);
        team.setProperty("date", date);
        team.setProperty("content", content);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(team);

        String responseMsg = "Test test test";

        resp.setContentType("application/json");
        resp.setContentLength(responseMsg.length());
        resp.getWriter().write(responseMsg); // write JSON string
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }

    public static void main(String[] args) {
        JsonObject json = Json.createObjectBuilder()
                .add("name", "John")
                .add("address", Json.createArrayBuilder().add("123 fake st").add("CO").add(22345))
                .build();

        System.out.println(json.getJsonArray("address"));
    }
}