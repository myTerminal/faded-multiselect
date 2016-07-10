/*global $, mocha, suite, test, assert, mochaPhantomJS, FadedMultiselect */

$(document).ready(function () {
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }
});

mocha.setup('tdd');

suite('faded-multiselect tests', function () {
    var multiselect = new FadedMultiselect();
    
    test('Adds the required markup', function () {
        assert.ok(true, "Great");
    });
});
