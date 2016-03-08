/*global define*/
define([], function () {

    'use strict';

    function ELEVATOR() {
        this.session = null;
        this.time = 0;
        this.floor = 1;
        this.people = [];
        this.direction = 'stationary';
        this.stops = [];
    }

    return ELEVATOR;

});