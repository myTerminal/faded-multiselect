/*global $, describe, before, after, it, assert, FadedMultiselect */

var originalMultiselectSelector = "#original-multiselect",
    globals = {
        originalMultiselect: null,
        optionsInOriginalMultiselect: null,
        optionValuesInOriginalMultiselect: null,
        multiselect: null,
        newMultiselect: null,
        multiselectButton: null,
        multiselectDropdown: null,
        optionsInNewMultiselect: null
    },
    refreshGlobals = function () {
        globals.originalMultiselect = $(originalMultiselectSelector);
        globals.optionsInOriginalMultiselect = globals.originalMultiselect.find("option");
        globals.optionValuesInOriginalMultiselect = $.map(globals.optionsInOriginalMultiselect,
                                                          function (e) {
                                                              return $(e).val();
                                                          });
        globals.newMultiselect = $(".faded-multiselect");
        globals.multiselectButton = globals.newMultiselect.find(".faded-multiselect-button");
        globals.multiselectDropdown = globals.newMultiselect.find(".faded-multiselect-dropdown");
        globals.optionsInNewMultiselect = globals.newMultiselect.find(".faded-multiselect-dropdown-option");
    };

describe("Tests for faded-multiselect", function() {
    describe("Markup", function() {
        var originalDropdownSelector = "#original-multiselect",
            multiselect = new FadedMultiselect(originalDropdownSelector);
        
        it("Should add the required markup", function () {
            assert.ok($(".faded-multiselect").length,
                      "Creates the parent of faded-multiselect");
        });

        it("Should bring back the original multiselect", function () {
            multiselect.destroy();
            assert.ok(!$(".faded-multiselect").length,
                      "Destroys the new DOM and brings back the native multiselect");
        });
    });

    describe("Basic functionality", function () {
        before(function () {
            globals.multiselect = new FadedMultiselect(originalMultiselectSelector);
            refreshGlobals();
        });

        after(function () {
            globals.multiselect.destroy();
        });

        it("Should list the same options in the dropdown", function () {
            var countOfOptionsInOriginalMultiselect = globals.optionsInOriginalMultiselect.length,
                countOfItemsInNewMultiselect = globals.optionsInNewMultiselect.length;

            assert.equal(countOfOptionsInOriginalMultiselect, countOfItemsInNewMultiselect,
                         "Has the same number of items in the new multiselect");

            var optionsInNewMultiselect = $.map(globals.optionsInNewMultiselect,
                                                function (e) {
                                                    return $(e).attr("data-value");
                                                });

            assert.deepEqual(globals.optionValuesInOriginalMultiselect, optionsInNewMultiselect,
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

        it("Should open and close the dropdown", function () {
            assert.ok(!globals.newMultiselect.hasClass("open"), "The dropdown is closed initially");

            globals.multiselectButton.mousedown();
            assert.ok(globals.newMultiselect.hasClass("open"), "The dropdown is opened on mousedown");

            globals.multiselectButton.mousedown();
            assert.ok(!globals.newMultiselect.hasClass("open"), "The dropdown is closed on mousedown");

            globals.multiselectButton.mousedown();
            $("body").mousedown();
            assert.ok(!globals.newMultiselect.hasClass("open"), "The dropdown is closed when mouse is down elsewhere");
        });

        it("Should sync selection between the two dropdowns", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            refreshGlobals();
            assert.deepEqual(globals.multiselect.getValue(), globals.originalMultiselect.val(),
                             "Gets an empty selection");

            globals.originalMultiselect.val(["option1"]);
            globals.multiselect.refresh();
            refreshGlobals();
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

    describe("Button Text", function () {
        before(function () {
            globals.multiselect = new FadedMultiselect(originalMultiselectSelector);
            refreshGlobals();
        });

        after(function () {
            globals.multiselect.destroy();
        });

        it("Should update the button text correctly", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            refreshGlobals();

            var buttonTextContainer = globals.multiselectButton.find(".faded-multiselect-button-text");

            assert.equal(buttonTextContainer.text(), "None selected",
                         "Displays 'None selected' when the selection is empty");

            var firstOption = $(globals.optionsInNewMultiselect[0]);

            firstOption.click();
            assert.equal(buttonTextContainer.text(), firstOption.find("span").text(),
                         "Displays the items that is selected");

            $(globals.optionsInNewMultiselect[1]).click();
            assert.equal(buttonTextContainer.text(), globals.multiselect.getValue().length + " selected",
                         "Displays the count of selected items");

            $(globals.optionsInNewMultiselect[2]).click();
            assert.equal(buttonTextContainer.text(), "All selected",
                         "Displays 'All selected' when no items are selected");
        });
    });

    describe("Advanced: 'All' options", function () {
        before(function () {
            globals.multiselect = new FadedMultiselect(originalMultiselectSelector, {
                allOption: true
            });
            refreshGlobals();
        });

        after(function () {
            globals.multiselect.destroy();
        });

        it("Should have an extra item for 'All'", function () {
            var countOfOptionsInOriginalMultiselect = globals.optionsInOriginalMultiselect.length,
                countOfItemsInNewMultiselect = globals.optionsInNewMultiselect.length;

            assert.equal(countOfOptionsInOriginalMultiselect + 1, countOfItemsInNewMultiselect,
                         "Has an extra item in the new multiselect");

            assert.equal(globals.optionsInNewMultiselect.find("span").first().text(), "All",
                         "Names the first item as 'All'");
        });

        it("Should toggle selection for all items when the 'All' option is clicked", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            refreshGlobals();

            var allOptionInMultiselect = globals.optionsInNewMultiselect.first();
            allOptionInMultiselect.click();

            assert.deepEqual(globals.multiselect.getValue(), globals.optionValuesInOriginalMultiselect,
                             "Selects all items when clicked on the 'All' option");

            refreshGlobals();
            allOptionInMultiselect = globals.optionsInNewMultiselect.first();
            allOptionInMultiselect.click();

            assert.deepEqual(globals.multiselect.getValue(), [],
                             "Empties selection when clicked on the 'All' option");
        });

        it("Should auto select/unselect the 'All' option according to the selection in the multiselect", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            refreshGlobals();

            $.each(globals.optionsInNewMultiselect, function (i, e) {
                if (i) {
                    $(e).click();
                }
            });

            var allOptionInMultiselect = globals.optionsInNewMultiselect.first(),
                allCheckbox = allOptionInMultiselect.find("input[type=checkbox]");

            assert.equal(allCheckbox.attr("checked"), "checked",
                         "Checks the 'All' option when all the items have been selected");

            $(globals.optionsInNewMultiselect[1]).click();
            assert.ok(allCheckbox.attr("checked") !== "checked",
                      "Unchecks the 'All' option when even one of the options have been unselected");
        });
    });

    describe("Advanced: Custom Button Text", function () {
        before(function () {
            globals.multiselect = new FadedMultiselect(originalMultiselectSelector, {
                buttonText: function (value) {
                    return value.length;
                }
            });
            refreshGlobals();
        });

        after(function () {
            globals.multiselect.destroy();
        });

        it("Should update the button text using custom function", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            refreshGlobals();

            var buttonTextContainer = globals.multiselectButton.find(".faded-multiselect-button-text");

            assert.equal(buttonTextContainer.text(), "0",
                         "Displays '0' when the selection is empty");

            var firstOption = $(globals.optionsInNewMultiselect[0]);

            firstOption.click();
            assert.equal(buttonTextContainer.text(), "1",
                         "Displays '1' when one items is selected");

            $(globals.optionsInNewMultiselect[1]).click();
            assert.equal(buttonTextContainer.text(), "2",
                         "Displays '2' when two items are selected");

            $(globals.optionsInNewMultiselect[2]).click();
            assert.equal(buttonTextContainer.text(), "3",
                         "Displays '3' when three items are selected");
        });
    });

    describe("Advanced: Change events", function () {
        before(function () {
            globals.multiselect = new FadedMultiselect(originalMultiselectSelector, {
                allOption: true,
                onStateChange: function (value, item) {
                    globals.lastValue = value;
                    globals.lastToggledValue = item;
                }
            });
            refreshGlobals();
        });

        after(function () {
            globals.multiselect.destroy();
        });

        it("Should trigger the provided handler when the state changes", function () {
            globals.originalMultiselect.val([]);
            globals.multiselect.refresh();
            refreshGlobals();

            var secondOption = $(globals.optionsInNewMultiselect[1]);

            secondOption.click();
            assert.deepEqual(globals.lastValue, globals.multiselect.getValue(),
                             "Passes current value to the handler");
            assert.equal(globals.lastToggledValue, secondOption.attr("data-value"),
                         "Passes the last selected item value to the handler");

            var firstOption = $(globals.optionsInNewMultiselect[0]);
            firstOption.click();
            assert.deepEqual(globals.lastValue, globals.multiselect.getValue(),
                             "Passes current value to the handler");
            assert.equal(globals.lastToggledValue, "all",
                         "Passes the last selected item value to the handler");
        });
    });

    describe("Advanced: Scrollbar", function () {
        before(function () {
            globals.multiselect = new FadedMultiselect(originalMultiselectSelector, {
                allOption: true,
                maxDropdownHeight: 50
            });
            refreshGlobals();
        });

        after(function () {
            globals.multiselect.destroy();
        });

        it("Markup for the scrollbar", function () {
            assert.ok(globals.multiselectDropdown.find(".faded-scrollbar-parent").length,
                      "Creates a scrollbar when told to");
        });

        it("Destroys the scrollbar on destroy", function () {
            globals.multiselect.destroy();
            refreshGlobals();
            assert.ok(!globals.multiselectDropdown.find(".faded-scrollbar-parent").length,
                      "Scrollbar is not there anymore");
        });
    });
});
