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

    public Tournament() {

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
