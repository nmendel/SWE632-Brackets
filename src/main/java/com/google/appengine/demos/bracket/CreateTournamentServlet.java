package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.*;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Created by hung on 11/10/14.
 */
public class CreateTournamentServlet extends HttpServlet {
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter(Constants.TOURNAMENT_NAME);
        String format = req.getParameter(Constants.TOURNAMENT_FORMAT);
        String numTeams = req.getParameter(Constants.NUM_TEAMS);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key key = KeyFactory.createKey(Constants.BRACKET_KEY, Constants.BRACKET_KEY);
        Date date = new Date();

        Entity entity = new Entity(Constants.TOURNAMENT_KEY, key);
        entity.setProperty(Constants.TOURNAMENT_NAME, name);
        entity.setProperty(Constants.TOURNAMENT_FORMAT, format);
        entity.setProperty(Constants.NUM_TEAMS, Integer.parseInt(numTeams));
        entity.setProperty(Constants.TOURNAMENT_START, date);
        entity.setProperty(Constants.TOURNAMENT_END, null);
        datastore.put(entity);

        resp.getWriter().write(entity.toString());
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        doPost(req, resp);
    }

    public void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        String tourneyName = req.getParameter(Constants.TOURNAMENT_NAME);
        String format = req.getParameter(Constants.TOURNAMENT_FORMAT);
        String numTeams = req.getParameter(Constants.NUM_TEAMS);

        Query query = new Query(Constants.TOURNAMENT_KEY);
        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TOURNAMENT_NAME, tourneyName));

        PreparedQuery pq = datastore.prepare(query);
        Entity entity = pq.asSingleEntity();
        entity.setProperty(Constants.TOURNAMENT_NAME, tourneyName);
        entity.setProperty(Constants.TOURNAMENT_FORMAT, format);
        entity.setProperty(Constants.NUM_TEAMS, Integer.parseInt(numTeams));
        datastore.put(entity);
    }
}
