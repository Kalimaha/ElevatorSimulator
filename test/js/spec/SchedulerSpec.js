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
                expect(s.CONFIG.elevators.length).toEqual(4);
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

        describe('Update Log', function () {

            it('When the log is updated the time should be increased by 1.', function () {
                s.init({
                    session: 'alpha'
                });
                s.update_time();
                expect(s.CONFIG.time).toEqual(1);
            });

            it('When the time is updated there should be 4 elements in the log.', function () {
                s.init({
                    session: 'alpha'
                });
                s.update_time();
                expect(s.CONFIG.log["t" + 1]).not.toBeUndefined();
                expect(s.CONFIG.log["t" + 1]['A']).not.toBeUndefined();
                expect(s.CONFIG.log["t" + 1]['B']).not.toBeUndefined();
                expect(s.CONFIG.log["t" + 1]['C']).not.toBeUndefined();
                expect(s.CONFIG.log["t" + 1]['D']).not.toBeUndefined();
                expect(s.CONFIG.log["t" + 1]['A'].floor).toEqual(1);
                expect(s.CONFIG.log["t" + 1]['B'].floor).toEqual(1);
                expect(s.CONFIG.log["t" + 1]['C'].floor).toEqual(1);
                expect(s.CONFIG.log["t" + 1]['D'].floor).toEqual(1);
            });

        });

    });

});