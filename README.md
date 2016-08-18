# faded-multiselect

[![Bower version](https://badge.fury.io/bo/faded-multiselect.svg)](https://badge.fury.io/bo/faded-multiselect)  
[![Build Status](https://travis-ci.org/myTerminal/faded-multiselect.svg?branch=master)](https://travis-ci.org/myTerminal/faded-multiselect)
[![Code Climate](https://codeclimate.com/github/myTerminal/faded-multiselect.png)](https://codeclimate.com/github/myTerminal/faded-multiselect)
[![Coverage Status](https://img.shields.io/coveralls/myTerminal/faded-multiselect.svg)](https://coveralls.io/r/myTerminal/faded-multiselect?branch=master)  
[![Dependency Status](https://david-dm.org/myTerminal/faded-multiselect.svg)](https://david-dm.org/myTerminal/faded-multiselect)
[![devDependency Status](https://david-dm.org/myTerminal/faded-multiselect/dev-status.svg)](https://david-dm.org/myTerminal/faded-multiselect#info=devDependencies)
[![peer Dependency Status](https://david-dm.org/myTerminal/faded-multiselect/peer-status.svg)](https://david-dm.org/myTerminal/faded-multiselect#info=peerDependencies)  
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![License](https://img.shields.io/badge/LICENSE-GPL%20v3.0-blue.svg)](https://www.gnu.org/licenses/gpl.html)
[![Gratipay](http://img.shields.io/gratipay/myTerminal.svg)](https://gratipay.com/myTerminal)

A simple skinnable multiselect dropdown for web

## Features

* An easy to use multiselect dropdown that works out of the box with a simple function invocation.
* Can be easily themed

## How to Use

Include `faded-multiselect.min.js` script file and `fade-multiselect.css` stylesheet along with jQuery in the HTML page.

Create an HTML multiselect as below:

    <select multiple id="select-to-be-tested">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
    </select>

Instantiate a multiselect dropdown on the `select` as below:

    multiselect = new FadedMultiselect("#select-to-be-tested");

When the HTML `select` changes (addition or removal of options), just invoke `refresh()` on the multiselect as

    multiselect.refresh();

In order to get an array of selected options, call `getValue()` on the multiselect as

    multiselect.getValue();

When the multiselect is no longer required, call a `destroy()` on the multiselect and the original multiselect will be brought back on the page.

    multiselect.destroy();

### Options

For an internal *Select All* and *Unselect All* option, initialize the multiselect as

    multiselect = new FadedMultiselect("#select-to-be-tested", {
        allOption: true
    });

To be notified on every value change, supply a function to be invoked on every state change as shown below

    multiselect = new FadedMultiselect("#select-to-be-tested", {
        onStateChange: function (value, item) {
            // Use 'value' to track the current selection
            // Use 'item' to track the currently toggled item
        }
    });

To set a custom dropdown button text, supply a function that returns the button text on a particular selection as shown below

    multiselect = new FadedMultiselect("#select-to-be-tested", {
        buttonText: function (value) {
            // Use 'value' to get an array of selection in the dropdown
        }
    });

To limit the dropdown height, supply `maxDropdownHeight` and a skinnable scrollbar will be used within the dropdown

    multiselect = new FadedMultiselect("#select-to-be-tested", {
        maxDropdownHeight: 200
    });

## Demo

You can view a demo [here](https://myterminal.github.io/faded-multiselect/example/)

## Dependency

* jQuery
* faded-scrollbar

## To-do

* Search functionality
* Auto sort selected items to the top

## Let me know

Let me know your suggestions on improving *faded-multiselect* at ismail@teamfluxion.com

Thank you!
