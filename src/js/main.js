/*global require,document*/
require.config({

    baseUrl: 'src/js/libs',

    paths: {
        app: '../app',
        html: '../../html',
        person: '../models/person',
        scheduler: '../core/scheduler',
        elevator: '../models/elevator',
        dbconnector: '../persistence/dbconnector'
    },

    shim: {
        bootstrap: ['jquery'],
        elevator_simulator: ['jquery']
    }

});

require(['app', 'domReady'], function (APP, domReady) {

    'use strict';

    domReady(function () {
        var app = new APP();
        app.init();
    });

});