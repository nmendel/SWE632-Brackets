package com.google.appengine.demos.bracket;

/**
 * Created by hung on 11/15/14.
 */
public class Tournament {
    public String t_id;
    public String t_name;
    public String t_format;
    public String t_create;
    public String t_start;
    public String t_end;
    public int t_size;
    public String teams;
    public String results;

    public Tournament() {

    }

    public void buildTeams() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("[");
        for (int i = 1; i <= t_size; i+=2) {
            buffer.append("[\"Team ").append(i).append("\",\"Team ").append(i+1).append("\"]");
            if (i != t_size/2) {
                buffer.append(",");
            }
        }
        buffer.append("]");

        teams = buffer.toString();
    }

    public void buildResults() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("[[");
        for (int i = 0; i < t_size/2; i++) {
            buffer.append("[1,0]");
            if (i != t_size/4 - 1) {
                buffer.append(",");
            }
        }
        buffer.append("]]");

        // double elimination

//        results = buffer.toString();
        results = "[[]]";
    }

    @Override
    public String toString() {
        return "Tournament{" +
                "t_name='" + t_name + '\'' +
                ", t_format='" + t_format + '\'' +
                ", t_size='" + t_size + '\'' +
                ", t_create='" + t_create + '\'' +
                ", t_start='" + t_start + '\'' +
                ", t_end='" + t_end + '\'' +
                '}';
    }
}
