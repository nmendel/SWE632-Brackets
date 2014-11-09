package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TournamentServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        String bracketName = Constants.BRACKET_KEY;
        Key bracketKey = KeyFactory.createKey(Constants.BRACKET_KEY, bracketName);

        testCode(datastore, bracketKey);

        StringBuffer json = new StringBuffer();
        for (Entity entity : getTournaments(datastore, bracketKey)) {
            json.append("{\"")
                .append(Constants.TOURNAMENT_NAME).append("\":\"")
                .append(entity.getProperty(Constants.TOURNAMENT_NAME)).append("\", \"")
                .append(Constants.TOURNAMENT_FORMAT).append("\":\"")
                .append(entity.getProperty(Constants.TOURNAMENT_FORMAT)).append("\", \"")
                .append(Constants.NUM_TEAMS).append("\":\"")
                .append(entity.getProperty(Constants.NUM_TEAMS)).append("\", \"")
                .append(Constants.TOURNAMENT_START).append("\":\"")
                .append(entity.getProperty(Constants.TOURNAMENT_START)).append("\", \"")
                .append(Constants.TOURNAMENT_END).append("\":\"")
                .append(entity.getProperty(Constants.TOURNAMENT_END)).append("\"},\n");
        }

        String str = "";
        if (json.length() - 2 >= 0) {
            str = json.toString().substring(0, json.length() - 2);
        }

        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json");
        resp.getWriter().write(str);
    }

    public List<Entity> getTournaments(DatastoreService datastore, Key key) {
        Query query = new Query(Constants.TEAM_KEY, key)
                .addSort(Constants.TEAM_NAME, Query.SortDirection.DESCENDING);
        return datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
    }

    public void testCode(DatastoreService datastore, Key key) {
        Date date = new Date();
        Entity tourn = new Entity(Constants.TOURNAMENT_KEY, key);
        tourn.setProperty(Constants.TOURNAMENT_NAME, "B-BALL");
        tourn.setProperty(Constants.TOURNAMENT_FORMAT, "Single Elimination");
        tourn.setProperty(Constants.NUM_TEAMS, 16);
        tourn.setProperty(Constants.TOURNAMENT_START, date);
        tourn.setProperty(Constants.TOURNAMENT_END, null);
        datastore.put(tourn);

        Entity tourn0 = new Entity(Constants.TOURNAMENT_KEY, key);
        tourn0.setProperty(Constants.TOURNAMENT_NAME, "B-BALL-2");
        tourn0.setProperty(Constants.TOURNAMENT_FORMAT, "Single Elimination");
        tourn0.setProperty(Constants.NUM_TEAMS, 16);
        tourn0.setProperty(Constants.TOURNAMENT_START, date);
        tourn0.setProperty(Constants.TOURNAMENT_END, null);
        datastore.put(tourn0);
    }
}
