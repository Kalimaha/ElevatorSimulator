/*global require, window*/
require.config({
    baseUrl: '../src',
    paths: {
        'jquery': ['../test/js/libs/jquery.min'],
        'q': ['../test/js/libs/q'],
        'jasmine': ['../test/js/libs/jasmine'],
        'jasmine-html': ['../test/js/libs/jasmine-html'],
        'jasmine-boot': ['../test/js/libs/boot'],
        'scheduler': ['../src/js/core/scheduler'],
        'dbconnector': ['../src/js/persistence/dbconnector'],
        'simulator-spec': ['../test/js/spec/SchedulerSpec'],
        'dbconnector-spec': ['../test/js/spec/DBConnectorSpec'],
        'elevator-spec': ['../test/js/spec/ElevatorSpec'],
        'person-spec': ['../test/js/spec/PersonSpec'],
        'person': ['../src/js/models/person'],
        'elevator': ['../src/js/models/elevator']
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