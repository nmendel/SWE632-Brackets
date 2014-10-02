<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="java.util.List" %>

<%@ page import="com.google.appengine.api.datastore.DatastoreService" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.Entity" %>
<%@ page import="com.google.appengine.api.datastore.FetchOptions" %>
<%@ page import="com.google.appengine.api.datastore.Key" %>
<%@ page import="com.google.appengine.api.datastore.KeyFactory" %>
<%@ page import="com.google.appengine.api.datastore.Query" %>

<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%
    String tournamentName = request.getParameter("tournamentName");
    if (tournamentName == null) {
        tournamentName = "default";
    }
    pageContext.setAttribute("tournamentName", tournamentName);
	
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key tournamentKey = KeyFactory.createKey("Tournament", tournamentName);
    // Run an ancestor query to ensure we see the most up-to-date
    // view of the Teams belonging to the selected Tournament.
    Query query = new Query("Team", tournamentKey).addSort("date", Query.SortDirection.DESCENDING);
    List<Entity> teams = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(5));
    if (!teams.isEmpty()) {

        for (Entity team : teams) {
            pageContext.setAttribute("team_content",
                    team.getProperty("content"));
%>
<div>${fn:escapeXml(team_content)}</div>
<%
        }
    }
%>
