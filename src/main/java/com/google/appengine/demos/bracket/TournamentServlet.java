package com.google.appengine.demos.bracket;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TournamentServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws IOException {
	  resp.addHeader("Access-Control-Allow-Origin", "*");
	  resp.setContentType("application/json");
      resp.getWriter().write("[{\"name\": \"Head Chef\"}, {\"name\": \"Big Wigg\"}, {\"name\": \"Cat Competition\"}]");
   }
}
