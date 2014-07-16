one41
=====

Project setup:

prerequisites:

- Java 1.7 JDK use in project configurations
- MySql 5.5
- NodeJS, grunt, bower
- IntelliJ, Grunt console


Steps:

1. Clone repository from Git: https://github.com/vladimirbukinac/one41.git  vladimirbukinac/askVladimirForPassword
2. IntelliJ-> "Open project" -> location of clone on filesystem

for backend:

1. one41/backend/pom.xml -> import as Maven project (downloads dependencies)
2. create webserver configuration:  Menu->Run->EditConfigurations->AddConfiguration->tomcatServer->Deployment->AddArtefact Exploded war
3. create database "one41" user one41/one41  change values in datasource.properties
4. Run webserver configuration. The REST services will be available on [http://localhost:8080/rest](http://localhost:8080/rest)


for frontend:

1. cd to one41/frontend  npm install - downloads grunt dependencies from package.json
2. cd to one41/frontend bower install - downloads javascript dependencies from bower.json
3. open Grunt console, run <code>grunt</code> to build the app, run <code>grunt serve</code> to deploy the app. This deploys frontend app on grunt's integrated server and proxy server which routes REST calls from fronted to backend app running on other server (tomcat)
The frontend app should be visible on [http://localhost:9000](http://localhost:9000). REST calls should now also be available through [http://localhost:9000/rest](http://localhost:9000/rest)
