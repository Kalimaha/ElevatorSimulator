/*global define, window*/
define(['jquery',
        'handlebars',
        'text!html/templates.hbs',
        'bootstrap'], function ($, Handlebars, templates) {

    'use strict';

    function APP() {

        this.CONFIG = {
            placeholder_id: 'placeholder',
            running: false,
            delay: 2000,
            time: 0,
            timer: null
        };

    }

    APP.prototype.init = function (config) {

        /* Extend the default configuration with user's  settings. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

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
        html = template({});
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

    };

    APP.prototype.start_simulation = function () {
        var that = this;
        this.CONFIG.running = true;
        this.timer = window.setInterval(function () {
            that.CONFIG.time = 1 + that.CONFIG.time;
            $('#time').html(that.CONFIG.time);
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
    };

    return APP;

});