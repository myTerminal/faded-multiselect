/*global $, describe, before, it, assert, mochaPhantomJS, FadedMultiselect */

var globals = {
    originalDropdownSelector: null,
    originalMultiselect: null,
    optionsInOriginalMultiselect: null,
    multiselect: null,
    newMultiselect: null,
    multiselectButton: null,
    multiselectDropdown: null,
    optionsInNewMultiselect: null
};

describe("Tests for faded-multiselect", function() {
    describe("Markup", function() {
        var originalDropdownSelector = "#original-multiselect",
            multiselect = new FadedMultiselect(originalDropdownSelector);
        
        it("Adds the required markup", function () {
            assert.ok($(".faded-multiselect").length,
                      "Creates the parent of faded-multiselect");
        });

        it("Brings back the original multiselect", function () {
            multiselect.destroy();
            assert.ok(!$(".faded-multiselect").length,
                      "Destroys the new DOM and brings back the native multiselect");
        });
    });

    describe("Basic functionality", function () {
        before(function () {
            globals.originalDropdownSelector = "#original-multiselect";
            globals.originalMultiselect = $(globals.originalDropdownSelector);
            globals.optionsInOriginalMultiselect = globals.originalMultiselect.find("option");
            globals.multiselect = new FadedMultiselect(globals.originalDropdownSelector);
            globals.newMultiselect = $(".faded-multiselect");
            globals.multiselectButton = globals.newMultiselect.find(".faded-multiselect-button");
            globals.multiselectDropdown = globals.newMultiselect.find(".faded-multiselect-dropdown");
            globals.optionsInNewMultiselect = globals.newMultiselect.find(".faded-multiselect-dropdown-option");
        });

        it("Lists the same options in the dropdown", function () {
            var countOfOptionsInOriginalMultiselect = globals.optionsInOriginalMultiselect.length,
                countOfItemsInNewMultiselect = globals.optionsInNewMultiselect.length;

            assert.equal(countOfOptionsInOriginalMultiselect, countOfItemsInNewMultiselect,
                         "Has the same number of items in the new multiselect");

            var optionsInOriginalMultiselect = $.map(globals.optionsInOriginalMultiselect,
                                                     function (e) {
                                                         return $(e).val();
                                                     }),
                optionsInNewMultiselect = $.map(globals.optionsInNewMultiselect,
                                                function (e) {
                                                    return $(e).attr("data-value");
                                                });

            assert.deepEqual(optionsInOriginalMultiselect, optionsInNewMultiselect,
                             "Has the same options in the new multiselect");

            var labelsInOriginalMultiselect = $.map(globals.optionsInOriginalMultiselect,
                                                    function (e) {
                                                        return $(e).text();
                                                    }),
                labelsInNewMultiselect = $.map(globals.optionsInNewMultiselect.find("span"),
                                               function (e) {
                                                   return $(e).html();
                                               });

            assert.deepEqual(labelsInOriginalMultiselect, labelsInNewMultiselect,
                             "Has the same text in the new multiselect");

        });

        it("Opens and closes the dropdown", function () {
            assert.ok(!globals.newMultiselect.hasClass("open"), "The dropdown is closed initially");

            globals.multiselectButton.click();
            assert.ok(globals.newMultiselect.hasClass("open"), "The dropdown is opened on click");

            globals.multiselectButton.click();
            assert.ok(!globals.newMultiselect.hasClass("open"), "The dropdown is closed on click");

            globals.multiselectButton.click();
            $("body").click();
            assert.ok(!globals.newMultiselect.hasClass("open"), "The dropdown is closed when clicked elsewhere");
        });

        it("Syncs selection between the two dropdowns", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            assert.deepEqual(globals.multiselect.getValue(), globals.originalMultiselect.val(),
                             "Gets an empty selection");

            globals.originalMultiselect.val(["option1"]);
            globals.multiselect.refresh();
            assert.deepEqual(globals.multiselect.getValue(), globals.originalMultiselect.val(),
                             "Syncs upwards to the new multiselect");

            var aSelectedOptionInMultiselect = globals.originalMultiselect.val()[0],
                optionInNewMultiselect = $(".faded-multiselect-dropdown-option[data-value=" + aSelectedOptionInMultiselect + "]"),
                checkboxInNewMultiselect = optionInNewMultiselect.find("input[type=checkbox]");
            assert.equal(checkboxInNewMultiselect.attr("checked"), "checked",
                         "Checks the checkbox for selection in the multiselect");

            optionInNewMultiselect.click();
            assert.notEqual(checkboxInNewMultiselect.attr("checked"), "checked",
                            "Unchecks the checkbox on click");
            assert.deepEqual(globals.originalMultiselect.val(), [],
                             "Clears the selection in the native multiselect");
            assert.deepEqual(globals.multiselect.getValue(), [],
                             "Reflects an empty value in the new multiselect");

            optionInNewMultiselect.click();
            assert.equal(checkboxInNewMultiselect.attr("checked"), "checked",
                         "Checks the checkbox on click");
            assert.deepEqual(globals.originalMultiselect.val(), ["option1"],
                             "Sets the selection in the native multiselect");
            assert.deepEqual(globals.multiselect.getValue(), ["option1"],
                             "Returns the right selection in the new multiselect");
        });
    });
});
