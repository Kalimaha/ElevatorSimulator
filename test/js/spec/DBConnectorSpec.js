/*global describe, define, beforeEach, it, expect*/
define(['db-connector'], function (DBCONNECTOR) {

    'use strict';

    var c;

    beforeEach(function () {
        c = new DBCONNECTOR();
    });

    describe('DB CONNECTOR', function () {

        describe('Configurability', function () {

            it('The simulator should have 2 urls', function () {
                expect(Object.keys(s.CONFIG.urls).length).toEqual(2);
            });

            it('One for testing...', function () {
                expect(s.CONFIG.urls.test).not.toBeUndefined();
            });

            it('...and one for production.', function () {
                expect(s.CONFIG.urls.production).not.toBeUndefined();
            });

        });

        describe('Get Elevators by session and time', function () {

            it('The connector refuses invalid environments.', function () {
                expect(function () {
                    c.get_by_session_and_time('deploy', 'alpha', 1);
                }).toThrowError('Please provide a valid environment ("test" or "production").');
            });

        });

    });

});