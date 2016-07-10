/*global $, mocha, suite, test, assert, mochaPhantomJS, FadedMultiselect */

$(document).ready(function () {
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }
});

mocha.setup('tdd');

suite('faded-multiselect tests', function () {
    var originalDropdownSelector = "#original-multiselect",
        multiselect = new FadedMultiselect(originalDropdownSelector);
    
    test('Adds the required markup', function () {
        assert.ok($(".faded-multiselect").length, "Creates the parent of faded-multiselect");
    });
});
