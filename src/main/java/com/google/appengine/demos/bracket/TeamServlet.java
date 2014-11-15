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

        StringBuffer json = new StringBuffer();
        json.append("[");
        
        List<Entity> entities = null;
        if(tournament != null) {
        	Key tournamentKey = KeyFactory.createKey(Constants.TOURNAMENT_KEY, tournament);
        	entities = getTeams(datastore, tournamentKey);
        } else {
        	entities = getTeams(datastore);
        }
        
        for (Entity entity : entities) {
            json.append("{\"")
                .append(Constants.TEAM_NAME).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_NAME)).append("\"");
            
            // optional
            if(entity.getProperty(Constants.TEAM_TOURNAMENT) != null) {
            	json.append(", \"").append(Constants.TEAM_TOURNAMENT).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_TOURNAMENT)).append("\"");
            }
            
            if(entity.getProperty(Constants.TEAM_SCORE) != null) {
                json.append(", \"").append(Constants.TEAM_SCORE).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_SCORE)).append("\"");
            }
            
            if(entity.getProperty(Constants.TEAM_LOCATION) != null) {
                json.append(", \"").append(Constants.TEAM_LOCATION).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_LOCATION)).append("\"");
            }
            
            json.append("},\n");
        }

        String str = "[]";
        if (json.length() - 2 >= 0) {
            str = json.toString().substring(0, json.length() - 2) + "]";
        }

        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json");
        resp.getWriter().write(str);
    }

    public List<Entity> getTeams(DatastoreService datastore, Key key) {
        Query query = new Query(Constants.TEAM_KEY, key)
                .addSort(Constants.TEAM_NAME, Query.SortDirection.DESCENDING);
        return datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
    }
    
    public List<Entity> getTeams(DatastoreService datastore) {
        Query query = new Query(Constants.TEAM_KEY)
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
    
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String teamName = req.getParameter(Constants.TEAM_NAME);
        String teamScore = req.getParameter(Constants.TEAM_SCORE);
        String teamLocation = req.getParameter(Constants.TEAM_LOCATION);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        Entity team = new Entity(Constants.TEAM_KEY);
        team.setProperty(Constants.TEAM_NAME, teamName);
        
        if(teamScore != null) {
        	team.setProperty(Constants.TEAM_SCORE, teamScore);
        }
        if(teamLocation != null) {
        	team.setProperty(Constants.TEAM_LOCATION, teamLocation);
        }
        
        datastore.put(team);

        resp.setContentType("application/json");
        resp.getWriter().write(team.toString());
    }

}
