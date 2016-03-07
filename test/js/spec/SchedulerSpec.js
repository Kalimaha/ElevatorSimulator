/*global describe, define, beforeEach, it, expect*/
define(['scheduler'], function (SCHEDULER) {

    'use strict';

    var s;

    beforeEach(function () {
        s = new SCHEDULER();
    });

    describe('Scheduler', function () {

        describe('Configurability', function () {

            it('The simulator should start at t = 0', function () {
                expect(s.CONFIG.time).toEqual(0);
            });

            it('The simulator should have 4 initial elevators', function () {
                expect(s.CONFIG.elevators.length).toEqual(0);
            });

        });

        describe('Initialization', function () {

            it('All the elevators should have a session ID.', function () {
                s.init({
                    session: 'alpha'
                });
                expect(s.CONFIG.elevators[0].session).toEqual('alpha');
                expect(s.CONFIG.elevators[1].session).toEqual('alpha');
                expect(s.CONFIG.elevators[2].session).toEqual('alpha');
                expect(s.CONFIG.elevators[3].session).toEqual('alpha');
            });

        });

    });

});