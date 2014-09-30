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

<html>
<head>
    <link type="text/css" rel="stylesheet" href="/stylesheets/main.css"/>
</head>

<body>

<%
    String tournamentName = request.getParameter("tournamentName");
    if (tournamentName == null) {
        tournamentName = "default";
    }
    pageContext.setAttribute("tournamentName", tournamentName);
    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    if (user != null) {
        pageContext.setAttribute("user", user);
%>

<p>Hello, ${fn:escapeXml(user.nickname)}! (You can
    <a href="<%= userService.createLogoutURL(request.getRequestURI()) %>">sign out</a>.)</p>
<%
} else {
%>
<p>Hello!
    <a href="<%= userService.createLoginURL(request.getRequestURI()) %>">Sign in</a>
    to include your name with teams you post.</p>
<%
    }
%>

<%
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key tournamentKey = KeyFactory.createKey("Tournament", tournamentName);
    // Run an ancestor query to ensure we see the most up-to-date
    // view of the Teams belonging to the selected Tournament.
    Query query = new Query("Team", tournamentKey).addSort("date", Query.SortDirection.DESCENDING);
    List<Entity> teams = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(5));
    if (teams.isEmpty()) {
%>
<p>Guestbook '${fn:escapeXml(tournamentName)}' has no messages.</p>
<%
} else {
%>
<p>Messages in Guestbook '${fn:escapeXml(tournamentName)}'.</p>
<%
    for (Entity team : teams) {
        pageContext.setAttribute("team_content",
                team.getProperty("content"));
        if (team.getProperty("user") == null) {
%>
<p>An anonymous person wrote:</p>
<%
} else {
    pageContext.setAttribute("team_user",
            team.getProperty("user"));
%>
<p><b>${fn:escapeXml(team_user.nickname)}</b> wrote:</p>
<%
    }
%>
<blockquote>${fn:escapeXml(team_content)}</blockquote>
<%
        }
    }
%>

<form action="/create" method="post">
    <div><textarea name="content" rows="3" cols="60"></textarea></div>
    <div><input type="submit" value="Create Team"/></div>
    <input type="hidden" name="tournamentName" value="${fn:escapeXml(tournamentName)}"/>
</form>

<form action="/bracket.jsp" method="get">
    <div><input type="text" name="tournamentName" value="${fn:escapeXml(tournamentName)}"/></div>
    <div><input type="submit" value="Switch Tournaments"/></div>
</form>

</body>
</html>