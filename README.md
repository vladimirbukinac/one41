one41
=====

Project setup:

prerequisites:

- Java 1.7 JDK use in project configurations
- MySql 5.5
- NodeJS, grunt, bower
- IntelliJ, Grunt console


Steps for setting up the development environment:

1. Clone repository from Git: https://github.com/vladimirbukinac/one41.git  vladimirbukinac/askVladimirForPassword
2. IntelliJ-> "Open project" -> location of clone on filesystem

for backend:

1. one41/backend/pom.xml -> import as Maven project (downloads dependencies)
2. create webserver configuration:  Menu->Run->EditConfigurations->AddConfiguration->tomcatServer->Deployment->AddArtifact Exploded war
3. create database "one41" user one41/one41  change values in datasource.properties
4. Run webserver configuration. The REST services will be available on [http://localhost:8080/rest](http://localhost:8080/rest)
* After starting the backend for the first time. Database tables will be created. Since insertions are not implemented yet, manually insert a user and a message rows on the database tables for testing purposes.


for frontend:

1. cd to one41/frontend  run <code>npm install</code> - downloads grunt dependencies from package.json
2. cd to one41/frontend  run <code>bower install</code> - downloads javascript dependencies from bower.json
3. open Grunt console, run <code>grunt</code> to build the app, run <code>grunt serve</code> to deploy the app. This deploys frontend app on grunt's integrated server and proxy server which routes REST calls from fronted to backend app running on other server (tomcat)
The frontend app should be visible on [http://localhost:9000](http://localhost:9000). REST calls should now also be available through [http://localhost:9000/rest](http://localhost:9000/rest)


Steps for deploying the application to staging environment:
===
1. cd to one41/backend  run <code>mvn clean install</code>  this creates a war file /target/one41backend-1.0.0-SNAPSHOT.war
2. cd to one41/frontend run <code>grunt</code> this rebuilds the project and creates a war file  /frontend/dist/frontend.war . Alternatively, just run <code>grunt war</code> to build a .war file from files currently contained in 'dist' folder.
3. copy frontend.war to tomcat/webapps folder
4. copy and rename one41backend-1.0.0-SNAPSHOT.war to tomcat/webapps/ROOT.war
5. start tomcat
6. open url  [localhost:8080/frontend](localhost:8080/frontend)
* Note that the backend webapp must be deployed as ROOT app because rest api call paths are hardcoded in frontend application code (e.g. to to "/rest/messages/latest")
* This should be changed to be parametrizable and CORS (or JSONP) should also be supported.


Yeoman upgrades
===

1. Added <code>grunt-connect-proxy</code> for rerouting rest requests to backend server when running the frontend app using "grunt serve".
   This bypasses cross-domain issues when backend and frontend apps are not running on the same server/port. This is used for development purposes.
2. Added <code>grunt-war</code> task for creating a war file from "dist" frontend code.
2.1 Also changed jsHint rules for Gruntfile.js because grunt-war doesn't follow CamelCase naming convention for it's configuration parameters.

3. modified <code>wiredep</code> to wire bower dependencies into karma.conf.js file


<pre><code>
wiredep: {
      ...
        test: {
            src: ['<%= yeoman.app %>/../test/karma.conf.js'],
            ignorePath:  /\.\.\//,
            fileTypes: {
                js: {
                    block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                    detect: {
                        js: /<script.*src=['"](.+)['"]>/gi
                    },
                    replace: {
                        js: '\'{{filePath}}\','
                    }
                }
            }
        }
    },
</code></pre>


File Upload support
===

1. Client-side:  <code>bower install ng-file-upload -save<code>
2. attach file to JSON - TODO

3. server-side:  pom.xml

<pre><code>
<!-- Apache Commons Upload -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.2.2</version>
        </dependency>

        <!-- Apache Commons Upload -->
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>1.3.2</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency>
</code></pre>

applicationContext.xml

<pre><code>
        <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
            <!--Max upload size is 8 MB-->
            <property name="maxUploadSize" value="8192000" />
        </bean>        
</code></pre>

MessageController.java

<pre><code>

  @InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder)
            throws ServletException {

        // Convert multipart object to byte[]
        binder.registerCustomEditor(byte[].class, new ByteArrayMultipartFileEditor());
        log.error("Init binder doing it's stuff");
    }
    
</code></pre>

	