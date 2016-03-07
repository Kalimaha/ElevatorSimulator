/*global define*/
define(['jquery'], function ($) {

    'use strict';

    function SCHEDULER() {

        this.CONFIG = {
            elevators: [
                {"id": "A", "session": null, "time": 0, "floor": 1, "people": 0, "direction": "stationary", "stops": []},
                {"id": "B", "session": null, "time": 0, "floor": 1, "people": 0, "direction": "stationary", "stops": []},
                {"id": "C", "session": null, "time": 0, "floor": 1, "people": 0, "direction": "stationary", "stops": []},
                {"id": "D", "session": null, "time": 0, "floor": 1, "people": 0, "direction": "stationary", "stops": []}
            ],
            time: 0,
            log: {},
            session: null
        };

    }

    SCHEDULER.prototype.init = function (config) {
        if (config.session === undefined || config.session === null) {
            throw new Error('Please specify a code for the session.');
        }
        var i;
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);
        for (i = 0; i < this.CONFIG.elevators.length; i += 1) {
            this.CONFIG.elevators[i].session = config.session;
        }
    };

    SCHEDULER.prototype.update_time = function () {
        var i,
            new_time = 1 + this.CONFIG.time;
        if (this.CONFIG.log["t" + new_time] === undefined) {
            this.CONFIG.log["t" + new_time] = {};
        }
        for (i = 0; i < this.CONFIG.elevators.length; i += 1) {
            if (this.CONFIG.log["t" + new_time][this.CONFIG.elevators[i].id] === undefined) {
                this.CONFIG.log["t" + new_time][this.CONFIG.elevators[i].id] = {
                    floor: this.CONFIG.elevators[i].floor
                }
            }
        }
        this.CONFIG.time = new_time;
    };

    return SCHEDULER;

});