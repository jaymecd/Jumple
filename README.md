Jumple - *very small and very useful tool*
=====================================

**Simple cross-browser/-platform Dependency Injection Container for Javascript**<br />
*inspired by work and talks of Fabien Potencier*

Simple Usage
------------

First, create new instance on Jumple and make it easy accessible:

    window.injector = new Jumple(); // simple, isn't it?

Second, set some parameters or closures:

    injector.set('min-point', 5.2); // some number
    injector.set('title', 'Hello world!'); // some string
    injector.set('initDate', new Date()); // any type you'd like

Third, retrive data and use it where its needed:

    var initDate = injector.get('initDate');
    var execTime = ((new Date()).getTime() - initDate.getTime()) / 1000;

    alert('Application is running '+ execTime +' seconds');

Advanced Usage
--------------

Assume that you instantiated Jumple and went through simple usage. So here we go:

    // set up closure to get Date object at current time position
    injector.set('now', function() {
        return new Date();
    });

    injector.get('now').toString(); // "Thu Jan 19 2012 23:33:52 GMT+0100 (Romance Standard Time)"
    // 14 sec later
    injector.get('now').toString(); // "Thu Jan 19 2012 23:34:06 GMT+0100 (Romance Standard Time)"

Now lets try to simplify it:

    // argument "c" of closure points to Jumple instance
    injector.set('execTime', function(c) {
        var initDate = c.get('initDate');
        return ((new Date()).getTime() - initDate.getTime()) / 1000;
    });

    // and the winner is:
    alert('Application is running '+ injector.get('execTime') +' seconds');

As you may noticed `injector.get('now')` return new Date object every time you get it.
But what if you would like to create object on-demand and later reuse it?

    // piece of cake
    injector.share('customDate', function() {
        return new Date();
    });

    injector.get('customDate').toString(); // "Thu Jan 19 2012 23:33:52 GMT+0100 (Romance Standard Time)" - created
    // 14 sec later
    injector.get('customDate').toString(); // "Thu Jan 19 2012 23:33:52 GMT+0100 (Romance Standard Time)" - reused

There is no difference between a parameter and an object, so you could use the `protect()` method to define a parameter as an anonymous function:

    injector.protect('fnParam', function() {
        return (new Date()).toString();
    });

    injector.get('fnParam'); // anonymous function returned

Don'n forget that `get()` return result of executed closure or parameter passed to `set()` method.

If you would like to raw value from Jumple, you should use `raw()` method - it return same value as you have set.


**Jumple is free software under [MIT License](https://raw.github.com/jaymecd/Jumple/master/LICENSE).**

*Copyright (c) 2012 Nikolai Zujev,<br />https://github.com/jaymecd/Jumple*
