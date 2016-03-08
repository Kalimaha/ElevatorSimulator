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
            current_time: 0,
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

    SCHEDULER.prototype.update_time = function (new_time) {

        /* Initiate variables. */
        var i;

        /* Add a new entry to the log. The key is the t plus the time, e.g. t4. */
        if (this.CONFIG.log["t" + new_time] === undefined) {
            this.CONFIG.log["t" + new_time] = {};
        }

        /* Copy the current situation of each elevator if there are no new entries. */
        for (i = 0; i < this.CONFIG.elevators.length; i += 1) {
            if (this.CONFIG.log["t" + new_time][this.CONFIG.elevators[i].id] === undefined) {
                this.CONFIG.log["t" + new_time][this.CONFIG.elevators[i].id] = {
                    floor: this.CONFIG.elevators[i].floor
                };
            }
        }

        /* Remove past events. */
        for (i = 0; i < Object.keys(this.CONFIG.log).length; i += 1) {
            if (Object.keys(this.CONFIG.log)[i] < 't' + new_time) {
                delete this.CONFIG.log[Object.keys(this.CONFIG.log)[i]];
            }
        }

        /* Store current time. */
        this.CONFIG.current_time = new_time;

    };

    SCHEDULER.prototype.get_closest_elevator = function (floor) {
        var i,
            dist,
            min = 100,
            schedule,
            elevator;
        schedule = this.CONFIG.log['t' + this.CONFIG.current_time];
        for (i = 0; i < Object.keys(schedule).length; i += 1) {
            dist = Math.abs(schedule[Object.keys(schedule)[i]].floor - floor);
            if (dist < min) {
                min = dist;
                elevator = Object.keys(schedule)[i];
            }
        }
        return elevator;
    };

    return SCHEDULER;

});