package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.*;
import com.google.gson.Gson;
import com.google.appengine.demos.bracket.Team;

import java.io.IOException;
import java.util.List;
import java.io.BufferedReader;

import javax.servlet.ServletException;
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

//    @Override
//    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        Gson gson = new Gson();
//        BufferedReader reader = req.getReader();
//        String json = reader.readLine();
//
//        if (json == null || json.isEmpty()) {
//            return;
//        }
//
//        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
//        Tournament tournament = gson.fromJson(json, Tournament.class);
//
//        System.out.println(tournament.toString());
//
//        // Query the entity with name
//        Query query = new Query(Constants.TOURNAMENT_KEY);
//        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TOURNAMENT_NAME, tournament.t_name));
//
//        PreparedQuery pq = datastore.prepare(query);
//        Entity entity = pq.asSingleEntity();
//
//        if (entity == null) {
//            return;
//        }
//
//        if (tournament.t_format != null) {
//            entity.setProperty(Constants.TOURNAMENT_FORMAT, tournament.t_format);
//        }
//
//        if (tournament.t_size != 0) {
//            entity.setProperty(Constants.TOURNAMENT_SIZE, tournament.t_size);
//        }
//
//        if (tournament.t_end != null) {
//            entity.setProperty(Constants.TOURNAMENT_END, tournament.t_end);
//        }
//
//        datastore.put(entity); // update
//
//        resp.addHeader("Access-Control-Allow-Origin", "*");
//        resp.getWriter().write("Successful");
//    }
    
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
		BufferedReader reader = req.getReader(); 
		String json = reader.readLine();
		
		Gson gson = new Gson();
		Team team = gson.fromJson(json, Team.class);  
		
		System.out.println(json);
		System.out.println(team.team_name);
		System.out.println(team.team_location);
		System.out.println(team.team_score);
		
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Entity teamEnt = new Entity(Constants.TEAM_KEY);

        teamEnt.setProperty(Constants.TEAM_NAME, team.team_name);
       	teamEnt.setProperty(Constants.TEAM_SCORE, team.team_score);

        if(team.team_location != null) {
        	teamEnt.setProperty(Constants.TEAM_LOCATION, team.team_location);
        }
        
        datastore.put(teamEnt);
				
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }

}
