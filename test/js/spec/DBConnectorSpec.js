/*global describe, define, beforeEach, it, expect*/
define(['dbconnector', 'q'], function (DBCONNECTOR, Q) {

    'use strict';

    var c;

    beforeEach(function () {
        c = new DBCONNECTOR();
    });

    describe('DB CONNECTOR', function () {

        describe('Configurability', function () {

            it('The simulator should have 2 urls', function () {
                expect(Object.keys(c.CONFIG.urls).length).toEqual(2);
            });

            it('One for testing...', function () {
                expect(c.CONFIG.urls.test).not.toBeUndefined();
            });

            it('...and one for production.', function () {
                expect(c.CONFIG.urls.production).not.toBeUndefined();
            });

        });

        describe('Get Elevators by session and time', function () {

            it('The connector refuses invalid environments.', function () {
                expect(function () {
                    c.get_by_session_and_id('deploy', 'alpha', 'A');
                }).toThrowError('Please provide a valid environment ("test" or "production").');
            });

            it('The connector should retrieve data from the DB.', function () {
                c.get_by_session_and_id('test', 'alpha', 'A').success(function (response) {
                    expect(response).not.toBeUndefined();
                });
            });

        });

        describe('Create an elevator', function () {

            var elevator_1 = {
                "id": "A",
                "session": "alpha",
                "time": 1,
                "floor": 1,
                "people": 0,
                "direction": "stationary",
                "stops": []
            };

            it('The elevator should be stored in the DB.', function () {
                c.create('test', elevator_1).success(function (response) {
                    expect(response).not.toBeUndefined();
                });
            });

        });

    });

});