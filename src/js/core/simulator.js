/*global define*/
define(['jquery'], function ($) {

    'use strict';

    function SIM() {

        this.CONFIG = {
            version: 0.1,
            table: {
                length: 5,
                height: 5
            },
            commands: ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'],
            facings: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
            position: {
                x: 0,
                y: 0,
                facing: null
            },
            command: null,
            reports: []
        };

    }

    SIM.prototype.init = function (config) {
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);
    };

    SIM.prototype.execute = function (commands) {
        var i,
            s,
            params;
        this.CONFIG.commands = commands;
        if (Array.isArray(commands)) {
            for (i = 0; i < this.CONFIG.commands.length; i += 1) {
                if (this.CONFIG.commands[i].toUpperCase().indexOf('PLACE') > -1) {
                    this.CONFIG.start_idx = i;
                    break;
                }
            }
            for (i = this.CONFIG.start_idx; i < this.CONFIG.commands.length; i += 1) {
                switch (this.CONFIG.commands[i].toUpperCase()) {
                case 'MOVE':
                    this.move();
                    break;
                case 'RIGHT':
                    this.right();
                    break;
                case 'LEFT':
                    this.left();
                    break;
                case 'REPORT':
                    this.CONFIG.reports.push(this.report());
                    break;
                default:
                    s = this.CONFIG.commands[i].substring(1 + this.CONFIG.commands[i].indexOf(' '));
                    params = s.split(',');
                    this.place(parseInt(params[0], 10), parseInt(params[1], 10), params[2]);
                    break;
                }
            }
        } else {
            if (this.CONFIG.commands === undefined || this.CONFIG.commands === null) {
                throw new Error('Please provide a valid command.');
            }
            this.CONFIG.commands = this.CONFIG.commands.toUpperCase();
            if (this.CONFIG.commands !== 'PLACE') {
                throw new Error('The first valid command to the robot must be the PLACE command.');
            }
        }
    };

    SIM.prototype.place = function (x, y, facing) {
        if (x >= this.CONFIG.table.length || x < 0) {
            throw new Error('Please place the robot ON the table.');
        }
        if (y >= this.CONFIG.table.height || y < 0) {
            throw new Error('Please place the robot ON the table.');
        }
        if ($.inArray(facing.toUpperCase(), this.CONFIG.facings) < 0) {
            throw new Error('Please provide a valid facing direction: NORTH, SOUTH, EAST or WEST');
        }
        this.CONFIG.position = {
            x: x,
            y: y,
            facing: facing.toUpperCase()
        };
    };

    SIM.prototype.move = function () {
        switch (this.CONFIG.position.facing) {
        case 'NORTH':
            if (1 + this.CONFIG.position.y < this.CONFIG.table.height) {
                this.CONFIG.position.y = 1 + this.CONFIG.position.y;
            }
            break;
        case 'SOUTH':
            if (this.CONFIG.position.y - 1 > -1) {
                this.CONFIG.position.y = this.CONFIG.position.y - 1;
            }
            break;
        case 'EAST':
            if (1 + this.CONFIG.position.x < this.CONFIG.table.length) {
                this.CONFIG.position.x = 1 + this.CONFIG.position.x;
            }
            break;
        case 'WEST':
            if (this.CONFIG.position.x - 1 > -1) {
                this.CONFIG.position.x = this.CONFIG.position.x - 1;
            }
            break;
        }
    };

    SIM.prototype.left = function () {
        switch (this.CONFIG.position.facing) {
        case 'NORTH':
            this.CONFIG.position.facing = 'WEST';
            break;
        case 'SOUTH':
            this.CONFIG.position.facing = 'EAST';
            break;
        case 'EAST':
            this.CONFIG.position.facing = 'NORTH';
            break;
        case 'WEST':
            this.CONFIG.position.facing = 'SOUTH';
            break;
        }
    };

    SIM.prototype.right = function () {
        switch (this.CONFIG.position.facing) {
        case 'SOUTH':
            this.CONFIG.position.facing = 'WEST';
            break;
        case 'NORTH':
            this.CONFIG.position.facing = 'EAST';
            break;
        case 'WEST':
            this.CONFIG.position.facing = 'NORTH';
            break;
        case 'EAST':
            this.CONFIG.position.facing = 'SOUTH';
            break;
        }
    };

    SIM.prototype.report = function () {
        return 'X: ' + this.CONFIG.position.x + ', Y: ' + this.CONFIG.position.y + ', FACING: ' + this.CONFIG.position.facing;
    };

    return SIM;

});