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

    };

    return APP;

});