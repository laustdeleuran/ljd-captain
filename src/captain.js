'use strict';



// Dependencies
var StarDate = require('stardate');



/**
 * @constant defaults
 * @desc
 * Default settings object
 */
var defaults = {
	name: 'James T. Kirk',
	debug: true
};




/**
 * @function noop
 * @desc 
 * No operation function
 */
function noop() {
}




/**
 * @function logWriter
 * @param {Object} arg
 * @desc 
 * Formats arg if arg is an error. "Inspired" by https://github.com/angular/angular.js/blob/master/src/ng/log.js#L123
 */
function formatError(arg) {
	if (arg instanceof Error) {
		if (arg.stack) {
			arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
		} else if (arg.sourceURL) {
			arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
		}
	}
	return arg;
}



/**
 * @function logFactory
 * @param {String} type
 * @return {Function} log
 * @desc 
 * Factory function that creates single method of logging. "Inspired" by https://github.com/angular/angular.js/blob/master/src/ng/log.js#L136
 */
function logFactory(type) {
	var console = window.console || {},
		logFn = console[type] || console.log || noop,
		hasApply = false;

	// Reading logFn.apply throws an error in IE11 in IE8 document mode. 
	try {
		hasApply = !!logFn.apply;
	} catch (e) {}

	if (hasApply) {
		return function() {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				args.push(formatError(arguments[i]));
			}
			return logFn.apply(console, args);
		};
	}

	return function (arg1, arg2) {
		logFn(arg1, arg2 === null ? '' : arg2);
	};
}



/**
 * @constant computer
 * @desc
 * Private object that all captains use for logging.
 */
var computer = {
	log: logFactory('log'),
	debug: logFactory('debug'),
	warn: logFactory('warn'),
	error: logFactory('error')
};


/**
 * @class Captain
 * @param {Bool} debug
 * @param {String} name
 * @desc
 * Constructor class. Captain is basically always a singleton (no Generations here).
 */
function Captain(debug, name) {
	this.settings = {
		name: typeof name === 'string' ? name : defaults.name,
		debug: typeof debug == 'boolean' ? debug : defaults.debug,
	};

	this.history = [];

	return this;
}
Captain.prototype.entry = function (type, args) {
	if (computer[type]) {
		computer[type].apply(this, args);
	}

	var entry = {
		stardate: new StarDate(),
		type: type,
		message: args
	};

	this.history.push(entry);

	return entry;
};
Captain.prototype.log = function () {
	return this.entry('log', arguments);
};
Captain.prototype.debug = function () {
	return this.entry('debug', arguments);
};
Captain.prototype.warn = function () {
	return this.entry('warn', arguments);
};
Captain.prototype.error = function () {
	return this.entry('error', arguments);
};
Captain.prototype.read = function () {
	var args;
	for (var i = 0; i < this.history.length; i++) {
		args = ['Captain\'s log, star date: ', this.history[i].stardate.stardate, '\n', this.history[i].message];
		if (computer[this.history[i].type]) {
			computer[this.history[i].type].apply(this, args);
		} else {
			computer.log.apply(this, args);
		}
	}
};



// Export
module.exports = Captain;