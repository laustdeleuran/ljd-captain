'use strict';



// Dependencies
var StarDate = require('stardate');




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
	var console = global.console || {},
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

	return function(arg1, arg2) {
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
 * @constant defaults
 * @desc
 * Default settings object
 */
var defaults = {
	name: 'James T. Kirk', // The only real Captain
	debug: true
};



/**
 * @class Captain
 * @param {String} name
 * @desc
 * Constructor class.
 */
function Captain(name) {
	this.settings = {
		name: typeof name === 'string' ? name : defaults.name,
		debug: defaults.debug
	};

	this.history = [];

	return this;
}

/**
 * @method Captain.toggleDebug
 * @param {Bool} bool - truthy/falsy value to set debug mode to. If undefined, will act as a switch from the current value.
 * @desc
 * Toggles debug mode. If false, all debug logs won't be outputted to console.
 */
Captain.prototype.toggleDebug = function(bool) {
	this.settings.debug = bool === undefined ? !this.settings.debug : !!bool;
	return this.settings.debug;
}

/**
 * @method Captain._entry
 * @param {String} type
 * @param {Array} args
 * @param {Bool} silent
 * @return {Object} entry
 * @desc
 * Internal helper. Enters a log entry (`args`) into the Captain log using `type`.
 */
Captain.prototype._entry = function(type, args, silent) {
	if (!silent && computer[type]) {
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

/**
 * @method Captain.log
 * @return {Object} entry
 * @desc
 * Enters a log entry (`arguments`) into the Captain log using `log`.
 */
Captain.prototype.log = function() {
	return this._entry('log', arguments);
};

/**
 * @method Captain.debug
 * @return {Object} entry
 * @desc
 * Enters a log entry (`arguments`) into the Captain log using `debug`. Only outputs if `Captain.settings.debug === true`.
 */
Captain.prototype.debug = function() {
	return this._entry('debug', arguments, !this.settings.debug);
};

/**
 * @method Captain.log
 * @return {Object} entry
 * @desc
 * Enters a log entry (`arguments`) into the Captain log using `warn`.
 */
Captain.prototype.warn = function() {
	return this._entry('warn', arguments);
};

/**
 * @method Captain.log
 * @return {Object} entry
 * @desc
 * Enters a log entry (`arguments`) into the Captain log using `error`.
 */
Captain.prototype.error = function() {
	return this._entry('error', arguments);
};

/**
 * @method Captain.log
 * @return {Object} entry
 * @desc
 * Outputs all log entries in `Captain.history` using `type`, showing the entered `stardate` and `message` (`arguments`).
 */
Captain.prototype.read = function() {
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
