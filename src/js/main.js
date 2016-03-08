/*global require,document*/
require.config({

    baseUrl: 'src/js/libs',

    paths: {
        app: '../app',
        html: '../../html',
        person: '../models/person',
        scheduler: '../core/scheduler',
        elevator: '../models/elevator',
        elevator_simulator: '../core/simulator'
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