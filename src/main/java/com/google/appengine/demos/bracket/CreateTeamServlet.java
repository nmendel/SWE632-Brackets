package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.*;
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
        String tournamentName = req.getParameter(Constants.TOURNAMENT_NAME);
        String teamName = req.getParameter(Constants.TEAM_NAME);
        String teamScore = req.getParameter(Constants.TEAM_SCORE);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key tournamentKey = KeyFactory.createKey(Constants.TOURNAMENT_KEY, tournamentName);

        Entity team = new Entity(Constants.TEAM_KEY, tournamentKey);
        team.setProperty(Constants.TEAM_NAME, teamName);
        team.setProperty(Constants.TEAM_TOURNAMENT, tournamentName);
        team.setProperty(Constants.TEAM_SCORE, teamScore);
        datastore.put(team);

        resp.setContentType("application/json");
        resp.getWriter().write(team.toString());
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }

    public void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        String tournamentName = req.getParameter(Constants.TOURNAMENT_NAME);
        String teamName = req.getParameter(Constants.TEAM_NAME);
        String teamScore = req.getParameter(Constants.TEAM_SCORE);

        Query query = new Query(Constants.TEAM_KEY);
        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TOURNAMENT_NAME, tournamentName));
        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TEAM_NAME, teamName));

        PreparedQuery pq = datastore.prepare(query);
        Entity entity = pq.asSingleEntity();
        entity.setProperty(Constants.TEAM_SCORE, teamScore);
        datastore.put(entity);
    }

    public static void main(String[] args) {
        JsonObject json = Json.createObjectBuilder()
                .add("name", "John")
                .add("address", Json.createArrayBuilder().add("123 fake st").add("CO").add(22345))
                .build();

        System.out.println(json.getJsonArray("address"));
    }
}