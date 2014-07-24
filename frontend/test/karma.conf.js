// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-07-07 using
// generator-karma 0.8.2

module.exports = function (config) {
    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            <!-- bower:js -->
            'bower_components/jquery/dist/jquery.js',
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/angular/angular.js',
            'bower_components/json3/lib/json3.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            <!-- endbower -->

            <!-- Manually define devDependencies from bower.json since wiredep doesnt copy them -->
            'bower_components/angular-mocks/angular-mocks.js',


            <!-- Manually list javascripts from index.html in the same order to ensure correct javascript file import order -->
            'app/scripts/app.js',
            'app/scripts/resources/frontend.properties.js',
            'app/scripts/modules/menu.js',
            'app/scripts/modules/login.js',
            'app/scripts/modules/posts.js',
            'app/scripts/modules/newPost.js',
            'app/scripts/modules/profile.js',
            'app/scripts/services/userService.js',
            'app/scripts/services/one41User.js',
            'app/scripts/services/feDateService.js',
            'app/scripts/services/postService.js',

            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            //'PhantomJS'
            'Chrome'
        ],

        // Which plugins to enable
        plugins: [
            //'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
