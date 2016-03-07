/*global require, window*/
require.config({
    baseUrl: '../src',
    paths: {
        'jquery': ['../test/js/libs/jquery.min'],
        'jasmine': ['../test/js/libs/jasmine'],
        'jasmine-html': ['../test/js/libs/jasmine-html'],
        'jasmine-boot': ['../test/js/libs/boot'],
        'scheduler': ['../src/js/core/scheduler'],
        'db-connector': ['../src/js/persistence/db_connector'],
        'simulator-spec': ['../test/js/spec/SchedulerSpec'],
        'db-connector-spec': ['../test/js/spec/DBConnectorSpec']
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
});

(function () {

    'use strict';

    require(['jasmine-boot'], function () {
        require(['hello-world-spec'], function () {
            window.onload();
        });
    });

}());