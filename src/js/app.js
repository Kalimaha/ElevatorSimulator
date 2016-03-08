/*global define, window*/
define(['jquery',
        'handlebars',
        'text!html/templates.hbs',
        'scheduler',
        'bootstrap'], function ($, Handlebars, templates, SCHEDULER) {

    'use strict';

    function APP() {

        this.CONFIG = {
            placeholder_id: 'placeholder',
            running: false,
            delay: 1000,
            time: 0,
            timer: null,
            session: null,
            directions: {
                up: 'fa-arrow-circle-o-up',
                down: 'fa-arrow-circle-o-down',
                stationary: 'fa-pause-circle'
            },
            max_people: 20
        };

    }

    APP.prototype.init = function (config) {

        /* Extend the default configuration with user's  settings. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Define a session ID. */
        this.CONFIG.session = this.generate_session_id();

        /* Initiate components. */
        this.CONFIG.SCHEDULER = new SCHEDULER();

        /* Variables. */
        var source,
            template,
            dynamic_data,
            html,
            floors = [],
            i,
            that = this;

        /* Initiate floors. */
        for (i = 10; i > 0; i -= 1) {
            floors.push({
                floor: i
            });
        }

        /* Load the main structure. */
        source = $(templates).filter('#main_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            floors: floors
        };
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Elevators at ground floor. */
        source = $(templates).filter('#elevator_structure').html();
        template = Handlebars.compile(source);
        html = template({
            people: [],
            direction: this.CONFIG.directions.stationary
        });
        $('#elevator_a_floor_1').html(html);
        $('#elevator_b_floor_1').html(html);
        $('#elevator_c_floor_1').html(html);
        $('#elevator_d_floor_1').html(html);

        /* Simulation controllers. */
        $('#start_button').click(function () {
            that.start_simulation();
        });
        $('#pause_button').click(function () {
            that.pause_simulation();
        });
        $('#reset_button').click(function () {
            that.reset_simulation();
        });

        /* Call buttons. */
        $('.call_button').click(function () {
            that.call_elevator(this);
        });

    };

    APP.prototype.call_elevator = function (button) {
        if (this.CONFIG.running === true) {
            var floor = $(button).data('floor'),
                people = parseInt($('#people_at_' + floor).val(), 10),
                going_to = parseInt($('#going_to_' + floor).val(), 10),
                closest_elevator;
            if (people > 0 && !isNaN(going_to) && going_to !== floor) {
                closest_elevator = this.CONFIG.SCHEDULER.get_closest_elevator(floor);
                this.CONFIG.SCHEDULER.add_to_schedule(closest_elevator, floor, going_to);
            } else {
                if (people < 1) {
                    alert('Please select a valid number of people.');
                } else if (isNaN(going_to)) {
                    alert('Please select a valid destination.');
                } else if (going_to === floor) {
                    alert('The destination must be different from the current floor.');
                }
            }
        } else {
            alert('Please start the simulation first.');
        }
    };

    APP.prototype.update_elevators = function () {

        /* Initiate variables. */
        var i,
            elevator_id,
            source,
            template,
            dynamic_data,
            html,
            people,
            going_to,
            j,
            people_left;

        /* Load elevator template. */
        source = $(templates).filter('#elevator_structure').html();
        template = Handlebars.compile(source);
        html = template({
            people: 0,
            direction: this.CONFIG.directions.stationary
        });

        /* Iterate over elevators. */
        for (i = 0; i < Object.keys(this.CONFIG.SCHEDULER.CONFIG.elevators).length; i += 1) {

            /* Draw the elevator. */
            elevator_id = Object.keys(this.CONFIG.SCHEDULER.CONFIG.elevators)[i];
            $('.elevator_' + elevator_id.toLowerCase()).html('|');
            dynamic_data = {
                people: this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people,
                direction: this.CONFIG.directions[this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].direction]
            };
            html = template(dynamic_data);
            $('#elevator_' + elevator_id.toLowerCase() + '_floor_' + this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor).html(html);

            /* Check whether the elevator has to stop. */
            if (this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor === this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].stops[0]) {

                /* The elevator has to stop: change icon. */
                this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].direction = 'stationary';

                /* Fetch parameters. */
                people = $('#people_at_' + this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor).val();
                going_to = $('#going_to_' + this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor).val();

                /* Disembark people at this floor. */
                if (this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people.length > 0) {
                    for (j = this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people.length - 1; j >= 0; j -= 1) {
                        if (this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people[j].disembark_at == this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor) {
                            this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people.splice(j, 1);
                        }
                    }
                }

                /* Embark people, up to 20. */
                people_left = 0;
                for (j = 0; j < people; j += 1) {
                    if (this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people.length < this.CONFIG.max_people) {
                        this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people.push({
                            disembark_at: going_to
                        });
                    } else {
                        people_left += 1;
                    }
                }

                /* Update the number of people waiting at the floor. */
                $('#people_at_' + this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor).val(people_left);

                /* Remove this stop from the elvator's schedule. */
                this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].stops.splice(0, 1);

            }

        }

    };

    APP.prototype.start_simulation = function () {
        var that = this;
        this.CONFIG.running = true;
        this.timer = window.setInterval(function () {
            that.CONFIG.time = 1 + that.CONFIG.time;
            $('#time').html(that.CONFIG.time);
            that.CONFIG.SCHEDULER.update_time(that.CONFIG.time);
            that.update_elevators();
        }, this.CONFIG.delay);
    };

    APP.prototype.pause_simulation = function () {
        this.CONFIG.running = false;
        window.clearInterval(this.timer);
    };

    APP.prototype.reset_simulation = function () {
        this.CONFIG.running = false;
        window.clearInterval(this.timer);
        this.CONFIG.time = 0;
        $('#time').html(this.CONFIG.time);
        this.CONFIG.session = this.generate_session_id();
    };

    APP.prototype.generate_session_id = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return APP;

});