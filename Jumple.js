/**
 * Jumple is a simple cross-browser/-platform Dependency Injection Container for
 * Javascript Inspired by work and talks of Fabien Potencier
 *
 * Author: Nikolai Zujev <nikolai.zujev@gmail.com> License: MIT License
 * https://github.com/jaymecd/Jumple Copyright (c) 2012 Nikolai Zujev
 *
 * jslint forin: true, nomen: true, maxerr: 50, maxlen: 120, indent: 4
 */
(function () {

    'use strict';

    var root = this,
        Jumple = null,
        previousJumple = root.Jumple,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        isObject = function (obj) {
            return toString.call(obj) === '[object Object]';
        },
        isFunction = function (obj) {
            return toString.call(obj) === '[object Function]';
        };

    /**
     * Just a simple constructor
     * @constructor
     * @param {Object} values [optional] Initial values
     */
    Jumple = root.Jumple = function (values) {
        this._data = {};

        if (values) {
            this.add(values);
        }
    };

    /**
     * Avoid name conflict within a global scope
     * @static
     * @returns {Jumple}
     */
    Jumple.noConflict = function () {
        root.Jumple = previousJumple;
        return this;
    };

    Jumple.prototype = {
        /**
         * Checks if a parameter or an object is set.
         *
         * @param {String} id The unique identifier
         * @returns {Boolean}
         */
        has : function (id) {
            return hasOwnProperty.call(this._data, id);
        },

        /**
         * Gets a parameter or an object.
         *
         * @param {String} id The unique identifier
         * @returns mixed The value of the parameter or an object
         * @throws {Error} if the identifier is not defined
         */
        get : function (id) {
            var value = this.raw(id);
            return isFunction(value) ? value(this) : value;
        },

        /**
         * Gets a parameter or the closure defining an object.
         *
         * @param {String} id The unique identifier
         * @returns mixed The value of the parameter or a closure to defined an object
         * @throws {Error} if the identifier is not defined
         */
        raw : function (id) {
            if (!this.has(id)) {
                throw new Error('Identifier "' + id + '" is not defined');
            }
            return this._data[id];
        },

        /**
         * Sets a parameter or an object.
         *
         * @param {String} id The unique identifier
         * @param value The value of the parameter or a closure to defined an object
         * @returns {Jumple}
         */
        set : function (id, value) {
            this._data[id] = value;
            return this;
        },

        /**
         * @param {Object} values Multiple key/value object to append
         * @returns {Jumple}
         */
        add : function (values) {
            if (!isObject(values)) {
                throw new Error('Expection {key:value} object; got: ' + typeof (values));
            }
            var key = null;
            for (key in values) {
                if (hasOwnProperty.call(values, key)) {
                    this.set(key, values[key]);
                }
            }
            return this;
        },

        /**
         * Unsets a parameter or an object.
         *
         * @param {String} id The unique identifier
         * @returns {Jumple}
         */
        unset : function (id) {
            this._data[id] = null;
            delete this._data[id];
            return this;
        },

        /**
         * Returns a closure that stores the result of the given closure for
         * uniqueness in the scope of this instance of Pimple.
         *
         * @param {String} id The unique identifier
         * @param {Function} callable A closure to wrap for uniqueness
         * @returns {Jumple}
         * @throws {Error} if the callable is not a function
         */
        share : function (id, callable) {
            if (!isFunction(callable)) {
                throw new Error('Expection function as callable; got: ' + typeof (callable));
            }
            return this.set(id, function (jumple) {
                if (!hasOwnProperty.call(callable, '__jumple_static')) {
                    callable.__jumple_static = callable(jumple);
                }
                return callable.__jumple_static;
            });
        },

        /**
         * Protects a callable from being interpreted as a service.
         *
         * This is useful when you want to store a callable as a parameter.
         *
         * @param {String} id The unique identifier
         * @param {Function} callable A closure to protect from being evaluated
         * @returns {Jumple}
         * @throws {Error} if the callable is not a function
         */
        protect : function (id, callable) {
            if (!isFunction(callable)) {
                throw new Error('Expection function as callable; got: ' + typeof (callable));
            }
            return this.set(id, function () {
                return callable;
            });
        },

        /**
         * List of all available elements with values to console
         */
        debug: function () {
            if (!root.console) {
                return;
            }
            var key = null;
            for (key in this._data) {
                if (hasOwnProperty.call(this._data, key)) {
                    root.console.log([key, this.get(key)]);
                }
            }
        }
    };
}());
