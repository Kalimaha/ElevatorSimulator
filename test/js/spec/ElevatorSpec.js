/*global describe, define, beforeEach, it, expect*/
define(['elevator'], function (ELEVATOR) {

    'use strict';

    var e;

    beforeEach(function () {
        e = new ELEVATOR();
    });

    describe('Elevator', function () {

        describe('Default Values', function () {

            it('session', function () {
                expect(e.session).toEqual(null);
            });

            it('time', function () {
                expect(e.time).toEqual(0);
            });

            it('floor', function () {
                expect(e.floor).toEqual(1);
            });

            it('people', function () {
                expect(e.people).toEqual([]);
            });

            it('direction', function () {
                expect(e.direction).toEqual('stationary');
            });

            it('stops', function () {
                expect(e.stops).toEqual([]);
            });

        });

    });

});