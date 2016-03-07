/*global define*/
define(['jquery',
        'handlebars',
        'text!html/templates.hbs',
        'bootstrap'], function ($, Handlebars, templates) {

    'use strict';

    function APP() {

        this.CONFIG = {
            placeholder_id: 'placeholder'
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
            i;

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
        $('#elevator_a_floor_1').html('<button class="btn btn-info" style="width: 100%;"><div class="badge">0 -</div></button>');
        $('#elevator_b_floor_1').html('<button class="btn btn-info" style="width: 100%;"><div class="badge">0 -</div></button>');
        $('#elevator_c_floor_1').html('<button class="btn btn-info" style="width: 100%;"><div class="badge">0 -</div></button>');
        $('#elevator_d_floor_1').html('<button class="btn btn-info" style="width: 100%;"><div class="badge">0 -</div></button>');

        /* Test API. */
        $.ajax({
            url: 'https://api.mlab.com/api/1/databases/elevator-test/collections/elevators/56dd2d4ee4b0c05f88d01ef5',
            method: 'GET',
            contentType: 'application/json',
            data: {
                apiKey: 'eJFJDDkM-cAmYj06ykd2yO_jtpaz8_or'
            },
            success: function (response) {
                console.log(response);
            },
            error: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });

    };

    return APP;

});