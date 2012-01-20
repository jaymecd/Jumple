/**
 * Jumple is a simple cross-browser/-platform Dependency Injection Container for Javascript
 * 		Inspired by work and talks of Fabien Potencier
 *
 * Author: Nikolai Zujev <nikolai.zujev@gmail.com>
 * License:  MIT License
 * https://github.com/jaymecd/Jumple
 * Copyright (c) 2012 Nikolai Zujev
 */
(function() {
	var root = this,
		previousJumple = root.Jumple,
		hasOwnProperty = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		isFunction = function(obj) {
            return toString.call(obj) == '[object Function]';
		};

	/**
	 * Just a simple constructor
	 */
	var Jumple = root.Jumple = function() {
		this._data = {};
	};

	/**
	 * Avoid name conflict within a global scope
	 *
	 * @return Jumple
	 */
	Jumple.noConflict = function() {
		root.Jumple = previousJumple;
		return this;
	};

	Jumple.prototype = {
		/**
		 * Checks if a parameter or an object is set.
		 *
		 * @param string id The unique identifier
		 * @return boolean
		 */
	    has: function(id) {
	    	return hasOwnProperty.call(this._data, id);
	    },

	    /**
	     * Gets a parameter or an object.
	     *
	     * @param string id The unique identifier
	     * @return mixed The value of the parameter or an object
	     * @throws Error if the identifier is not defined
	     */
	    get: function(id) {
	    	var value = this.raw(id);

	    	return isFunction(value) ? value(this) : value;
	    },

	    /**
	     * Gets a parameter or the closure defining an object.
	     *
	     * @param string id The unique identifier
	     * @return mixed The value of the parameter or a closure to defined an object
	     * @throws Error if the identifier is not defined
	     */
	    raw: function(id) {
	    	if (!this.has(id)) {
	    		throw new Error('Identifier "'+ id +'" is not defined');
	    	}

	    	return this._data[id];
	    },

	    /**
	     * Sets a parameter or an object.
	     *
	     * @param string id The unique identifier
	     * @param mixed value The value of the parameter or a closure to defined an object
	     * @return Jumple
	     */
	    set: function(id, value) {
	    	this._data[id] = value;
	    	return this;
	    },

	    /**
	     * Unsets a parameter or an object.
	     *
	     * @param string id The unique identifier
	     * @return Jumple
	     */
	    unset: function(id) {
	    	this._data[id] = null;
	    	delete this._data[id];
	    	return this;
	    },

	    /**
	     * Returns a closure that stores the result of the given closure for
	     * uniqueness in the scope of this instance of Pimple.
	     *
	     * @param string id The unique identifier
	     * @param Function callable A closure to wrap for uniqueness
	     * @return Jumple
	     * @throws Error if the callable is not a function
	     */
	    share: function(id, callable) {
	    	if (!isFunction(callable)) {
	    		throw new Error('Expection function as callable; got: '+ typeof(callable));
	    	}

	    	return this.set(id, function(jumple) {
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
	     * @param string id The unique identifier
	     * @param Function callable A closure to protect from being evaluated
	     * @return Jumple
	     * @throws Error if the callable is not a function
	     */
	    protect: function(id, callable) {
	    	if (!isFunction(callable)) {
	    		throw new Error('Expection function as callable; got: '+ typeof(callable));
	    	}

	    	return this.set(id, function(jumple) {
	            return callable;
	        });
	    }
	};
}).call(this);
