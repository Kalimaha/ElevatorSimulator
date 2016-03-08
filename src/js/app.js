/*global define, window*/
define(['jquery',
        'handlebars',
        'text!html/templates.hbs',
        'scheduler',
        'person',
        'db_connector',
        'bootstrap'], function ($, Handlebars, templates, SCHEDULER, PERSON, DBCONNECTOR) {

    'use strict';

    function APP() {

        this.C = {
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
            },
            max_people: 20
        };

    }

    APP.prototype.init = function (config) {

        /* Variables. */
        var source,
            template,
            dynamic_data,
            html,
            floors = [],
            i,
            that = this;

        /* Extend the default configuration with user's  settings. */
        this.C = $.extend(true, {}, this.C, config);

        /* Define a session ID. */
        this.C.session = this.generate_session_id();

        /* Initiate components. */
        this.C.SCHEDULER = new SCHEDULER();
        this.C.SCHEDULER.init({session: this.C.session});
        this.C.DBCONNECTOR = new DBCONNECTOR();

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
        $('#' + this.C.placeholder_id).html(html);

        /* Elevators at ground floor. */
        source = $(templates).filter('#elevator_structure').html();
        template = Handlebars.compile(source);
        html = template({
            people: [],
            direction: this.C.directions.stationary
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

        /* History buttons. */
        $('.history_button').click(function () {
            that.show_history($(this).data('history'));
        });

    };

    APP.prototype.show_history = function (elevator_id) {
        this.C.DBCONNECTOR.get_by_session_and_id('test', this.C.session, elevator_id).then(function (response) {
            var s = '', i;
            for (i = 0; i < response.length; i += 1) {
                s += '<tr><td>' + response[i].session + '</td><td>' + response[i].time + '</td><td>' + response[i].floor + '</td><td>' + response[i].direction + '</td></tr>';
            }
            $('#modal_content').append(s);
            $('#modal_history').modal('show');
        }).fail(function (error) {
            console.log(error);
        });
    };

    APP.prototype.call_elevator = function (button) {
        if (this.C.running === true) {
            var floor = $(button).data('floor'),
                people = parseInt($('#people_at_' + floor).val(), 10),
                going_to = parseInt($('#going_to_' + floor).val(), 10),
                closest_elevator;
            if (people > 0 && !isNaN(going_to) && going_to !== floor) {
                closest_elevator = this.C.SCHEDULER.get_closest_elevator(floor);
                this.C.SCHEDULER.add_to_schedule(closest_elevator, floor, going_to);
                $('#going_to_' + floor).prop('disabled', true);
                $('#call_' + floor).prop('disabled', true);
                $('#status_' + floor).html('WAITING');
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
            direction: this.C.directions.stationary
        });

        /* Iterate over elevators. */
        for (i = 0; i < Object.keys(this.C.SCHEDULER.C.elevators).length; i += 1) {

            /* Draw the elevator. */
            elevator_id = Object.keys(this.C.SCHEDULER.C.elevators)[i];
            $('.elevator_' + elevator_id.toLowerCase()).html('|');
            dynamic_data = {
                people: this.C.SCHEDULER.C.elevators[elevator_id].people,
                direction: this.C.directions[this.C.SCHEDULER.C.elevators[elevator_id].direction]
            };
            html = template(dynamic_data);
            $('#elevator_' + elevator_id.toLowerCase() + '_floor_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).html(html);

            /* Persist the elevator. */
            this.C.SCHEDULER.C.elevators[elevator_id].id = elevator_id;
            this.C.SCHEDULER.C.elevators[elevator_id].time = this.C.time;
            this.C.DBCONNECTOR.create('test', this.C.SCHEDULER.C.elevators[elevator_id]).then(function (response) {
                /* stored correctly */
            });

            /* Check whether the elevator has to stop. */
            if (this.C.SCHEDULER.C.elevators[elevator_id].floor === this.C.SCHEDULER.C.elevators[elevator_id].stops[0]) {

                /* The elevator has to stop: change icon. */
                this.C.SCHEDULER.C.elevators[elevator_id].direction = 'stationary';
                $('#going_to_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).prop('disabled', false);
                $('#call_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).prop('disabled', false);
                $('#status_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).html('ON HOLD');

                /* Fetch parameters. */
                people = $('#people_at_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).val();
                going_to = $('#going_to_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).val();

                /* Disembark people at this floor. */
                if (this.C.SCHEDULER.C.elevators[elevator_id].people.length > 0) {
                    for (j = this.C.SCHEDULER.C.elevators[elevator_id].people.length - 1; j >= 0; j -= 1) {
                        if (this.C.SCHEDULER.C.elevators[elevator_id].people[j].disembark_at == this.C.SCHEDULER.C.elevators[elevator_id].floor) {
                            this.C.SCHEDULER.C.elevators[elevator_id].people.splice(j, 1);
                        }
                    }
                }

                /* Embark people, up to 20. */
                people_left = 0;
                for (j = 0; j < people; j += 1) {
                    if (this.C.SCHEDULER.C.elevators[elevator_id].people.length < this.C.max_people) {
                        this.C.SCHEDULER.C.elevators[elevator_id].people.push(new PERSON(going_to));
                    } else {
                        people_left += 1;
                    }
                }

                /* Update the number of people waiting at the floor. */
                $('#people_at_' + this.C.SCHEDULER.C.elevators[elevator_id].floor).val(people_left);

                /* Remove this stop from the elvator's schedule. */
                this.C.SCHEDULER.C.elevators[elevator_id].stops.splice(0, 1);

            }

        }

    };

    APP.prototype.start_simulation = function () {
        var that = this;
        this.C.running = true;
        this.timer = window.setInterval(function () {
            that.C.time = 1 + that.C.time;
            $('#time').html(that.C.time);
            that.C.SCHEDULER.update_time(that.C.time);
            that.update_elevators();
        }, this.C.delay);
    };

    APP.prototype.pause_simulation = function () {
        this.C.running = false;
        window.clearInterval(this.timer);
    };

    APP.prototype.reset_simulation = function () {
        this.C.running = false;
        window.clearInterval(this.timer);
        this.C.time = 0;
        $('#time').html(this.C.time);
        this.C.session = this.generate_session_id();
    };

    APP.prototype.generate_session_id = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return APP;

});