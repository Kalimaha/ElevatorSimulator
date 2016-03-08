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
            delay: 2000,
            time: 0,
            timer: null,
            session: null,
            directions: {
                up: 'fa-arrow-circle-o-up',
                down: 'fa-arrow-circle-o-down',
                stationary: 'fa-pause-circle'
            }
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
            people: 0,
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
            if (that.CONFIG.running === true) {
                var floor = $(this).data('floor'),
                    people = parseInt($('#people_at_' + floor).val(), 10),
                    going_to = parseInt($('#going_to_' + floor).val(), 10),
                    closest_elevator;
                if (people > 0 && !isNaN(going_to) && going_to !== floor) {
                    closest_elevator = that.CONFIG.SCHEDULER.get_closest_elevator(floor);
                    that.CONFIG.SCHEDULER.add_to_schedule(closest_elevator, floor, going_to);
                } else {
                    if (people < 1) {
                        alert('Please select a valid number of people.');
                    }
                    else if (isNaN(going_to)) {
                        alert('Please select a valid destination.');
                    }
                    else if (going_to === floor) {
                        alert('The destination must be different from the current floor.');
                    }
                }
            } else {
                alert('Please start the simulation first.');
            }
        });

    };

    APP.prototype.draw_elevators = function () {

        /* Initiate variables. */
        var i,
            elevator_id,
            source,
            template,
            dynamic_data,
            html;

        /* Load elevator template. */
        /* Elevators at ground floor. */
        source = $(templates).filter('#elevator_structure').html();
        template = Handlebars.compile(source);
        html = template({
            people: 0,
            direction: this.CONFIG.directions.stationary
        });

        for (i = 0; i < Object.keys(this.CONFIG.SCHEDULER.CONFIG.elevators).length; i += 1) {
            elevator_id = Object.keys(this.CONFIG.SCHEDULER.CONFIG.elevators)[i];
            $('.elevator_' + elevator_id.toLowerCase()).html('|');
            dynamic_data = {
                people: this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].people,
                direction: this.CONFIG.directions[this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].direction]
            };
            html = template(dynamic_data);
            $('#elevator_' + elevator_id.toLowerCase() + '_floor_' + this.CONFIG.SCHEDULER.CONFIG.elevators[elevator_id].floor).html(html);
        }
        console.log('');
    };

    APP.prototype.start_simulation = function () {
        var that = this;
        this.CONFIG.running = true;
        this.timer = window.setInterval(function () {
            that.CONFIG.time = 1 + that.CONFIG.time;
            $('#time').html(that.CONFIG.time);
            that.CONFIG.SCHEDULER.update_time(that.CONFIG.time);
            that.draw_elevators();
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