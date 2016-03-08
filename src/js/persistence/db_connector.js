/*global define*/
define(['jquery', 'q'], function ($, Q) {

    'use strict';

    function DB_CONNECTOR() {

        this.CONFIG = {
            urls: {
                test: 'https://elevatorsdata.herokuapp.com/elevators/test/',
                production: 'https://elevatorsdata.herokuapp.com/elevators/production/'
            }
        };

    }

    DB_CONNECTOR.prototype.init = function (config) {
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);
    };

    DB_CONNECTOR.prototype.get_by_session_and_id = function (environment, session, id) {
        if (environment !== 'test' && environment !== 'production') {
            throw new Error('Please provide a valid environment ("test" or "production").');
        }
        return Q($.ajax({
            url: this.CONFIG.urls[environment] + session + '/' + id + '/',
            traditional: true,
            data: {
                session: session,
                id: id
            },
            type: 'GET'
        }));
    };

    DB_CONNECTOR.prototype.create = function (environment, elevator) {
        if (environment !== 'test' && environment !== 'production') {
            throw new Error('Please provide a valid environment ("test" or "production").');
        }
        return Q($.ajax({
            url: this.CONFIG.urls[environment],
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(elevator),
            type: 'POST'
        }));
    };

    return DB_CONNECTOR;

});