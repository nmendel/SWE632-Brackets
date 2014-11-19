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
        	
        	// Only return active teams
        	if(!entity.getProperty(Constants.TEAM_ACTIVE).equals("1")) {
        		continue;
        	}
        
            json.append("{\"")
                .append(Constants.TEAM_NAME).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_NAME)).append("\"");
            
            json.append(", \"")
                .append(Constants.TEAM_ID).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_ID)).append("\"");
            
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
            
            if(entity.getProperty(Constants.TEAM_ACTIVE) != null) {
                json.append(", \"").append(Constants.TEAM_ACTIVE).append("\": \"")
                .append(entity.getProperty(Constants.TEAM_ACTIVE)).append("\"");
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
                .addSort(Constants.TEAM_ID, Query.SortDirection.DESCENDING);
        return datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
    }
    
    public List<Entity> getTeams(DatastoreService datastore) {
        Query query = new Query(Constants.TEAM_KEY)
                .addSort(Constants.TEAM_ID, Query.SortDirection.DESCENDING);
        return datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        BufferedReader reader = req.getReader();
        String json = reader.readLine();

        if (json == null || json.isEmpty()) {
            return;
        }

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        Team team = gson.fromJson(json, Team.class);

        System.out.println(team.toString());

        // Query the entity with name
        Query query = new Query(Constants.TEAM_KEY);
        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TEAM_ID, team.team_id));

        PreparedQuery pq = datastore.prepare(query);
        Entity entity = pq.asSingleEntity();

        if (entity == null || team.team_id == null) {
            resp.addHeader("Access-Control-Allow-Origin", "*");
            resp.getWriter().write("No record");
            return;
        }

        if (team.team_name != null) {
            entity.setProperty(Constants.TEAM_NAME, team.team_name);
        }

        if (team.team_score != 0) {
            entity.setProperty(Constants.TEAM_SCORE, team.team_score);
        }

        if (team.team_active != null) {
            entity.setProperty(Constants.TEAM_ACTIVE, team.team_active);
        }

        if (team.team_location != null) {
            entity.setProperty(Constants.TEAM_LOCATION, team.team_location);
        }

        datastore.put(entity); // update

        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.getWriter().write("Successful");
    }
    
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
		BufferedReader reader = req.getReader(); 
		String json = reader.readLine();
		
		Gson gson = new Gson();
		Team team = gson.fromJson(json, Team.class); 
		Key k = KeyFactory.createKey("Team", team.team_name);
			
		// Return json back without saving anything if a blank team name is passed in
		if( team.team_name == null || team.team_name.equals("") ) {
			team.team_active = "1";
			team.team_id = KeyFactory.keyToString(k);
			resp.addHeader("Access-Control-Allow-Origin", "*");
        	resp.getWriter().write(team.toJSON());
        	return;
		}
			
		// If we're doing an update, first invalidate the old team, and create a new one
		// We know this is an update since it has an id which our front end does not assign.
		if(!(team.team_id == null || team.team_id.equals(""))) {
			deactivateTeam(team.team_id);
		}
		
		team.team_active = "1";
		team.team_id = KeyFactory.keyToString(k); // TODO: we need an autogenerated unique identifier that will be different evertime and this is not one
		createTeam(team);

		resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.getWriter().write(team.toJSON());
	}
		
	public void createTeam(Team team) {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Entity teamEnt = new Entity(Constants.TEAM_KEY);

        teamEnt.setProperty(Constants.TEAM_NAME, team.team_name);
        teamEnt.setProperty(Constants.TEAM_ID, team.team_id);
       	teamEnt.setProperty(Constants.TEAM_SCORE, team.team_score);
       	
       	String active = team.team_active;
       	if(active.equals("") || active == null) {
       		active = "1";
       	}
		teamEnt.setProperty(Constants.TEAM_ACTIVE, active);

        if(team.team_location != null) {
        	teamEnt.setProperty(Constants.TEAM_LOCATION, team.team_location);
        }
        
        datastore.put(teamEnt);
    }
    
    public void deactivateTeam(String id) {
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        // Query the entity with id
        Query query = new Query(Constants.TEAM_KEY);
        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TEAM_NAME, id));

        PreparedQuery pq = datastore.prepare(query);
        Entity entity = pq.asSingleEntity();

        if (entity == null) {
            return;
        }

        entity.setProperty(Constants.TEAM_ACTIVE, "0");
		
        datastore.put(entity); // update
    }
}
