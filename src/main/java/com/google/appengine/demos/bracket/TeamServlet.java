package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.*;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TeamServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String tournament = req.getParameter(Constants.TOURNAMENT_NAME);
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key tournamentKey = KeyFactory.createKey(Constants.TOURNAMENT_KEY, tournament);

        StringBuffer json = new StringBuffer();
        for (Entity entity : getTeams(datastore, tournamentKey)) {
            json.append("{\"")
                .append(Constants.TEAM_NAME).append("\":\"")
                .append(entity.getProperty(Constants.TEAM_NAME)).append("\", \"")
                .append(Constants.TEAM_TOURNAMENT).append("\":\"")
                .append(entity.getProperty(Constants.TEAM_TOURNAMENT)).append("\", \"")
                .append(Constants.TEAM_SCORE).append("\":\"")
                .append(entity.getProperty(Constants.TEAM_SCORE)).append("\"},\n");
        }

        String str = "";
        if (json.length() - 2 >= 0) {
            str = json.toString().substring(0, json.length() - 2);
        }

        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json");
        resp.getWriter().write(json.toString());
    }

    public List<Entity> getTeams(DatastoreService datastore, Key key) {
        Query query = new Query(Constants.TEAM_KEY, key)
                .addSort(Constants.TEAM_NAME, Query.SortDirection.DESCENDING);
        return datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
    }

    public void testCode(DatastoreService datastore, Key key) {
        Entity team0 = new Entity(Constants.TEAM_KEY, key);
        team0.setProperty(Constants.TEAM_NAME, "name1");
        team0.setProperty(Constants.TEAM_TOURNAMENT, "tourney1");
        team0.setProperty(Constants.TEAM_SCORE, "23");
        datastore.put(team0);

        Entity team1 = new Entity(Constants.TEAM_KEY, key);
        team1.setProperty(Constants.TEAM_NAME, "name2");
        team1.setProperty(Constants.TEAM_TOURNAMENT, "tourney1");
        team1.setProperty(Constants.TEAM_SCORE, "20");
        datastore.put(team1);
    }

}
