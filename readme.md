# Captain.JS

A real log. For real starship captains.

## Usage

First, summon your captain:

```js
var captain = new Captain();
```

Then go ahead, and log your log entries

```js
captain.log('Captain\'s Log, supplemental. Our computer core has clearly been tampered with and yet there is no sign of a breach of security on board. We have engines back and will attempt to complete our mission.');
// Returns: log entry Object, containing message, type and stardate
```

You can also get your captain to read your entire log for you, as it was entered:

```js
captain.read();
// Outputs: Every entry in your `captain.history`
```

You can also access your captain's log in the `captain.history` array.

## Settings

The *constructor* `new Captain(name)` supports one parameter: `name`, which sets your Captains name. Defaults to `'James T. Kirk'`. 

Secondly, debug mode can be set in `captain.settings.debug` or controlled by using `captain.toggleDebug()`. This controls if debug level logs are outputted or not.

## API

### Methods

All *log* methods (`.log()`, `.debug()`, `.warn()` and `.error()`) are used in the same way, much as the native `console.log()`. Your captain should sort out any environmental (browser) issues you might normally experience. 

All *log* methods also enters your entry into your Captain's `.history` array.

#### `Captain.log()`

Outputs a normal log with `arguments`. Returns a log entry Object containing your `message` (`arguments`), `type` (`log`) and the current `stardate` using [StarDate](https://www.npmjs.com/package/stardate).

#### `Captain.debug()`

Outputs a debug log with `arguments`. Returns a log entry Object containing your `message` (`arguments`), `type` (`debug`) and the current `stardate` using [StarDate](https://www.npmjs.com/package/stardate). Be aware that debug-level logs might not be output if `settings.debug` is set to false.

#### `Captain.warn()`

Outputs a warning log with `arguments`. Returns a log entry Object containing your `message` (`arguments`), `type` (`warn`) and the current `stardate` using [StarDate](https://www.npmjs.com/package/stardate).

#### `Captain.error()`

Outputs a error log with `arguments`. Returns a log entry Object containing your `message` (`arguments`), `type` (`error`) and the current `stardate` using [StarDate](https://www.npmjs.com/package/stardate).

#### `Captain.read()`

Outputs all log entries in `Captain.history` using `type`, showing the entered `stardate` and `message` (`arguments`).

#### `Captain.toggleDebug(bool)`

This set's your Captain's behaviour - specifically whether or not debug level logs should be outputted. This method accepts one argument `bool`, the truthy/falsy value to set debug mode to. If `undefined`, the method will act as a switch from the current value.

### Properties

#### `Captain.history`

`Array` containing all log entries made by your Captain.

---

<img src="http://bkkt.ljd.dk/agreement.gif" alt="" />