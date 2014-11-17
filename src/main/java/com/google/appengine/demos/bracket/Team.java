package com.google.appengine.demos.bracket;


public class Team {
    public int id;
  	public String team_id = null;
  	public String team_name = null;
  	public String team_location = null;
  	public int team_score = 0;
  	public String team_active = "1";
  	
  	Team() {
  	
  	}

    @Override
    public String toString() {
        return "Team{" +
                "id=" + id +
                ", team_name='" + team_name + '\'' +
                ", team_location='" + team_location + '\'' +
                ", team_score=" + team_score +
                '}';
    }
}