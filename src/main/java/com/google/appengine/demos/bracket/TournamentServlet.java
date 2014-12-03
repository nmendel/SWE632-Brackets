package com.google.appengine.demos.bracket;

import com.google.appengine.api.datastore.*;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TournamentServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        List <Entity> entities = getTournaments(datastore);

        StringBuffer json = new StringBuffer();
        json.append("[");

        String results = null, teams = null;
        for (Entity entity : entities) {
			
			json.append("{\"")
				.append(Constants.TOURNAMENT_NAME).append("\": \"")
				.append(entity.getProperty(Constants.TOURNAMENT_NAME)).append("\"");
            
					
			if(entity.getProperty(Constants.TOURNAMENT_SIZE) != null) {
				json.append(", \"")
					.append(Constants.TOURNAMENT_SIZE).append("\": \"")
					.append(entity.getProperty(Constants.TOURNAMENT_SIZE)).append("\"");
			}
            
            // optional
            if(entity.getProperty(Constants.TOURNAMENT_FORMAT) != null) {
            	json.append(", \"").append(Constants.TOURNAMENT_FORMAT).append("\": \"")
                .append(entity.getProperty(Constants.TOURNAMENT_FORMAT)).append("\"");
            }
            
            if(entity.getProperty(Constants.TOURNAMENT_CREATEDATE) != null) {
                json.append(", \"").append(Constants.TOURNAMENT_CREATEDATE).append("\": \"")
                .append(entity.getProperty(Constants.TOURNAMENT_CREATEDATE)).append("\"");
            }
            
            if(entity.getProperty(Constants.TOURNAMENT_START) != null) {
                json.append(", \"").append(Constants.TOURNAMENT_START).append("\": \"")
                .append(entity.getProperty(Constants.TOURNAMENT_START)).append("\"");
            }
            
            if(entity.getProperty(Constants.TOURNAMENT_END) != null) {
                json.append(", \"").append(Constants.TOURNAMENT_END).append("\": \"")
                .append(entity.getProperty(Constants.TOURNAMENT_END)).append("\"");
            }
            
            if(entity.getProperty(Constants.TOURNAMENT_TEAMS) != null) {
                teams = ((Text) entity.getProperty(Constants.TOURNAMENT_TEAMS)).getValue();

                json.append(", \"").append(Constants.TOURNAMENT_TEAMS).append("\":").append(teams);
            }
            
            if(entity.getProperty(Constants.TOURNAMENT_RESULTS) != null) {
                results = ((Text) entity.getProperty(Constants.TOURNAMENT_RESULTS)).getValue();

                json.append(", \"").append(Constants.TOURNAMENT_RESULTS).append("\": ").append(results);
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
    
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Gson gson = new Gson();
        BufferedReader reader = req.getReader();
        String json = reader.readLine();

        if (json == null || json.isEmpty()) {
            return;
        }

        Tournament tournament = gson.fromJson(json, Tournament.class);
        tournament.buildTeams();
        tournament.buildResults();
        
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key key = KeyFactory.createKey(Constants.BRACKET_KEY, Constants.BRACKET_KEY);
        
		DateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
		Date today = new Date();
		String date = df.format(today);

        Entity entity = new Entity(Constants.TOURNAMENT_KEY, key);
        entity.setProperty(Constants.TOURNAMENT_NAME, tournament.t_name);
        entity.setProperty(Constants.TOURNAMENT_FORMAT, tournament.t_format);
        entity.setProperty(Constants.TOURNAMENT_SIZE, tournament.t_size);
        entity.setProperty(Constants.TOURNAMENT_CREATEDATE, date);
        entity.setProperty(Constants.TOURNAMENT_START, null);
        entity.setProperty(Constants.TOURNAMENT_END, null);
        entity.setProperty(Constants.TOURNAMENT_TEAMS, new Text(tournament.teams));
        entity.setProperty(Constants.TOURNAMENT_RESULTS, new Text(tournament.results));
        datastore.put(entity);

        resp.getWriter().write(entity.toString());
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
        Tournament tournament = gson.fromJson(json, Tournament.class);

        System.out.println(tournament.toString());

        // Query the entity with name
        Query query = new Query(Constants.TOURNAMENT_KEY);
        query.setFilter(Query.FilterOperator.EQUAL.of(Constants.TOURNAMENT_NAME, tournament.t_name));

        PreparedQuery pq = datastore.prepare(query);
        Entity entity = pq.asSingleEntity();

        if (entity == null) {
            return;
        }

        if (tournament.t_format != null) {
            entity.setProperty(Constants.TOURNAMENT_FORMAT, tournament.t_format);
        }

        if (tournament.t_size != 0) {
            entity.setProperty(Constants.TOURNAMENT_SIZE, tournament.t_size);
        }

        if (tournament.t_start != null) {
            entity.setProperty(Constants.TOURNAMENT_START, tournament.t_start);
        }

        if (tournament.t_end != null) {
            entity.setProperty(Constants.TOURNAMENT_END, tournament.t_end);
        }

        if (tournament.teams != null) {
            entity.setProperty(Constants.TOURNAMENT_TEAMS, tournament.teams);
        }

        if (tournament.results != null) {
            entity.setProperty(Constants.TOURNAMENT_RESULTS, tournament.results);
        }

        datastore.put(entity); // update

        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.getWriter().write(entity.toString());
    }

    public List<Entity> getTournaments(DatastoreService datastore) {
        Query query = new Query(Constants.TOURNAMENT_KEY)
                .addSort(Constants.TOURNAMENT_START, Query.SortDirection.DESCENDING);
        return datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
    }
}
