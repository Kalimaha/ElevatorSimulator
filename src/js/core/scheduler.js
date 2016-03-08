/*global define*/
define(['jquery', 'elevator', 'dbconnector'], function ($, ELEVATOR, DBCONNECTOR) {

    'use strict';

    function SCHEDULER() {

        this.C = {
            elevators: {
                "A": new ELEVATOR(),
                "B": new ELEVATOR(),
                "C": new ELEVATOR(),
                "D": new ELEVATOR()
            },
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
        this.C = $.extend(true, {}, this.C, config);
        for (i = 0; i < Object.keys(this.C.elevators).length; i += 1) {
            this.C.elevators[Object.keys(this.C.elevators)[i]].session = config.session;
        }
        this.C.DBCONNECTOR = new DBCONNECTOR();
    };

    SCHEDULER.prototype.update_time = function (new_time) {

        /* Initiate variables. */
        var i,
            elevator_id,
            old_floor,
            schedule;

        /* Add a new entry to the log. The key is the t plus the time, e.g. t4. */
        if (this.C.log["t" + new_time] === undefined) {
            this.C.log["t" + new_time] = {};
        }

        /* Copy the current situation of each elevator if there are no new entries. */
        for (i = 0; i < Object.keys(this.C.elevators).length; i += 1) {

            /* Store elevator's ID. */
            elevator_id = Object.keys(this.C.elevators)[i];

            /* Add new entry to the schedule. */
            if (this.C.log["t" + new_time][elevator_id] === undefined) {
                this.C.log["t" + new_time][elevator_id] = {
                    floor: this.C.elevators[elevator_id].floor
                };
            }

            /* Or update the floor of the elevator. */
            else {
                old_floor = this.C.elevators[elevator_id].floor;
                if (old_floor < this.C.log["t" + new_time][elevator_id].floor) {
                    this.C.elevators[elevator_id].direction = 'up';
                } else if (old_floor === this.C.log["t" + new_time][elevator_id].floor) {
                    this.C.elevators[elevator_id].direction = 'stationary';
                } else {
                    this.C.elevators[elevator_id].direction = 'down';
                }
                this.C.elevators[elevator_id].floor = this.C.log["t" + new_time][elevator_id].floor;
            }

        }

        /* Store current time. */
        this.C.current_time = new_time;

    };

    SCHEDULER.prototype.get_closest_elevator = function (floor) {
        var i,
            dist,
            min = 100,
            schedule,
            elevator;
        schedule = this.C.log['t' + this.C.current_time];
        for (i = 0; i < Object.keys(this.C.elevators).length; i += 1) {
            console.log(this.C.elevators[Object.keys(this.C.elevators)[i]].floor);
            dist = Math.abs(this.C.elevators[Object.keys(this.C.elevators)[i]].floor - floor);
            if (dist <= min) {
                min = dist;
                elevator = Object.keys(schedule)[i];
            }
        }
        return elevator;
    };

    SCHEDULER.prototype.add_to_schedule = function (elevator_id, from_floor, to_floor) {

        /* Initiate variables. */
        var current_floor = this.C.log['t' + this.C.current_time][elevator_id].floor,
            time = this.C.current_time;

        /* Route to people who are waiting. */
        time = this.route(elevator_id, current_floor, from_floor, time);
        this.C.elevators[elevator_id].stops.push(from_floor);

        /* Route to where they have to go. */
        time = this.route(elevator_id, from_floor, to_floor, time);
        this.C.elevators[elevator_id].stops.push(to_floor);

    };

    SCHEDULER.prototype.route = function (elevator_id, from_floor, to_floor, time) {
        var i;
        if (from_floor <= to_floor) {
            for (i = from_floor; i <= to_floor; i += 1) {
                time += 1;
                if (this.C.log['t' + time] === undefined) {
                    this.C.log['t' + time] = {};
                }
                this.C.log['t' + time][elevator_id] = {};
                this.C.log['t' + time][elevator_id].floor = i;
                this.C.elevators[elevator_id].time = time;
                this.C.elevators[elevator_id].id = elevator_id;
            }
        } else {
            for (i = from_floor; i >= to_floor; i -= 1) {
                time += 1;
                if (this.C.log['t' + time] === undefined) {
                    this.C.log['t' + time] = {};
                }
                this.C.log['t' + time][elevator_id] = {};
                this.C.log['t' + time][elevator_id].floor = i;
                this.C.elevators[elevator_id].time = time;
                this.C.elevators[elevator_id].id = elevator_id;
            }
        }
        return time;
    };

    return SCHEDULER;

});