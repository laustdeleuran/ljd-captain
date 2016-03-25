'use strict';



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
 * @class Captain
 * @param {Bool} debug
 * @param {String} name
 * @desc
 * Constructor class. Captain is basically always a singleton (no Generations here).
 */
function Captain(debug, name) {
	this.name = typeof name === 'string' ? name : defaults.name;
	this.debug = typeof debug == 'boolean' ? debug : defaults.debug;

	return this;
}
Captain.prototype.log = logFactory('log');
Captain.prototype.warn = logFactory('warn');
Captain.prototype.error = logFactory('error');
Captain.prototype.debug = logFactory('debug');



// AMD support
(function(root, name, factory) {
	if (typeof module !== 'undefined') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	}
	// Fall back to a global variable
	else {
		root[name] = factory();
	}
}(this, 'captain', function() {
	return new Captain();
}));