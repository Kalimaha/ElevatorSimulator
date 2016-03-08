/*global describe, define, beforeEach, it, expect*/
define(['person'], function (PERSON) {

    'use strict';

    describe('Person', function () {
        var p = new PERSON(10);
        it('The disembark floor is set during the initialization.', function () {
            expect(p.disembark_at).toEqual(10);
        });

    });

});