/*global require,document*/
require.config({

    baseUrl: 'src/js/libs',

    paths: {
        app: '../app',
        html: '../../html',
        person: '../models/person',
        scheduler: '../core/scheduler',
        elevator: '../models/elevator',
        db_connector: '../persistence/db_connector'
    },

    shim: {
        bootstrap: ['jquery'],
        elevator_simulator: ['jquery']
    }

});

require(['app'], function (APP) {

    'use strict';

    var app = new APP();
    app.init();

});