Live Bracket

Current Testing Instructions:
go to repo
mvn clean install
mvn appengine:devserver

go to:
http://localhost:8080/bracket.jsp?tournamentName=default
or use curl (doesn't quite work right yet):
curl -X post localhost:8080/create?tournamentName=default -H 'content-type: application/json; charset=utf-9' -d "{'content': 'test_team_from_curl', 'team_content': '12345', 'tournamentName': 'default'}"