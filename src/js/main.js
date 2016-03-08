/*global require,document*/
require.config({

    baseUrl: 'src/js/libs',

    paths: {

        app: '../app',
        elevator_simulator: '../core/simulator',
        scheduler: '../core/scheduler',
        html: '../../html'

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