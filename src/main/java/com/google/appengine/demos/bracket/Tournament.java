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
        for (int i = 0; i < t_size/2; i++) {
            buffer.append("[--,--]");
            if (i != t_size/2 - 1) {
                buffer.append(",");
            }
        }
        buffer.append("]");

        teams = buffer.toString();
    }

    public void buildResults() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("[");
        for (int i = 0; i < t_size/4; i++) {
            buffer.append("[[0,0],[0,0]]");
            if (i != t_size/4 - 1) {
                buffer.append(", ");
            }
        }
        buffer.append("]");

        results = buffer.toString();
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
