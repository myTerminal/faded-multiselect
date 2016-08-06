/*global $, mocha, describe, it, assert, mochaPhantomJS, FadedMultiselect */

describe('Tests for faded-multiselect', function() {
    describe('Markup creation', function() {
        var originalDropdownSelector = "#original-multiselect",
            multiselect = new FadedMultiselect(originalDropdownSelector);
        
        it('Adds the required markup', function () {
            assert.ok($(".faded-multiselect").length,
                      "Creates the parent of faded-multiselect");
        });
    });
});
