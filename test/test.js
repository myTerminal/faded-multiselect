/*global $, mocha, describe, it, assert, mochaPhantomJS, FadedMultiselect */

describe('Array', function() {
    describe('#indexOf()', function() {
        var originalDropdownSelector = "#original-multiselect",
            multiselect = new FadedMultiselect(originalDropdownSelector);
        
        it('Adds the required markup', function () {
            assert.ok($(".faded-multiselect").length,
                      "Creates the parent of faded-multiselect");
        });
    });
});
