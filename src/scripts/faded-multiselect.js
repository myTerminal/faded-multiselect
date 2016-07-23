var FadedMultiselect = function (elementSelector, options) {
    var om = $(elementSelector).first(),
        labels = {
            buttonSelect: "Select",
            selected: "selected",
            noneSelected: "None selected",
            allSelected: "All selected"
        },
        parentTemplate = "" +
            "<div class='faded-multiselect'>" +
            "  <button class='faded-multiselect-button'>" +
            "    <span class='faded-multiselect-button-text'>" +
            "      " + labels.buttonSelect +
            "    </span>" +
            "    <div class='caret'>&#9662;</div>" +
            "  </button>" +
            "  <div class='faded-multiselect-dropdown'></div>" +
            "  <div class='original-multiselect'></div>" +
            "</div>",
        optionTemplate = "" +
            "<div class='faded-multiselect-dropdown-option'>" +
            "  <input type='checkbox'>" +
            "  <span>OptionX</span>" +
            "</div>",
        fmParent,

        init = function () {
            fmParent = $(parentTemplate);
            om = om.replaceWith(fmParent);
            fmParent.find(".original-multiselect").append(om);

            refresh();
            bindClose();
        },

        refresh = function () {
            unbindEvents();
            clearItems();

            addAllOption();
            copyItemsFromSelect();
            
            fmParent.find(".faded-multiselect-button").bind("click", onButtonClick);
            fmParent.find(".faded-multiselect-dropdown-option").bind("click", onItemClick);

            updateButtonText();
        },

        destroy = function () {
            fmParent.replaceWith(om);
        },

        getValue = function () {
            return om.val();
        },

        bindClose = function () {
            $("html").bind("click", function () {
                fmParent.removeClass("open");
            });
        },

        unbindEvents = function () {
            fmParent.find(".faded-multiselect-button").unbind("click");
            fmParent.find(".faded-multiselect-dropdown-option").unbind("click");
        },

        clearItems = function () {
            fmParent.find(".faded-multiselect-dropdown").html("");
        },

        addAllOption = function () {
            if (!options.allOption) {
                return;
            }

            var allOption = $(optionTemplate);

            allOption.find("span").html("All");
            allOption.attr("data-value", "");
            allOption.attr("data-special", "all");
            fmParent.find(".faded-multiselect-dropdown").append(allOption);
        },

        copyItemsFromSelect = function () {
            $.each(om.find("option"), function (i, e) {
                var oldOption = $(e),
                    newOption = $(optionTemplate);

                newOption.find("span").html(oldOption.html());
                newOption.attr("data-value", oldOption.val());
                fmParent.find(".faded-multiselect-dropdown").append(newOption);
            });

            loadItemStatesFromNative();
            loadSpecialItemStates();
        },

        loadItemStatesFromNative = function () {
            $.each(om.find("option"), function (i, e) {
                var oldOption = $(e),
                    isSelected = oldOption[0].selected,
                    value = $(e).attr("value"),
                    newOption = fmParent.find(".faded-multiselect-dropdown").find("[data-value=" + value + "]"),
                    checkbox = newOption.find("input[type=checkbox]");

                checkbox.attr("checked", isSelected);
            });
        },

        loadSpecialItemStates = function () {
            if (!options.allOption) {
                return;
            }

            var selectionLength = getValue().length,
                totalOptions = om.find("option").length,
                checkboxForAll = fmParent.find("[data-special=all] input[type=checkbox]");

            if (getValue().length === om.find("option").length) {
                checkboxForAll.attr("checked", true);
            } else if (!getValue().length) {
                checkboxForAll.attr("checked", false);
            }
        },

        saveItemStateToNative = function (item) {
            if ($(item).attr("data-special") === "all") {
                toggleSelectAllItems();
            } else {
                var value = $(item).attr("data-value"),
                    option = om.find("option[value=" + value + "]")[0];

                option.selected = !option.selected;
            }
        },

        onButtonClick = function (event) {
            event.stopPropagation();

            $(this).closest(".faded-multiselect").toggleClass("open");
        },

        onItemClick = function (event) {
            event.stopPropagation();

            var checkbox = $(this).find("input[type=checkbox]");

            checkbox.attr("checked", !checkbox.attr("checked"));
            saveItemStateToNative($(this));

            updateButtonText();
            setStateForAll();
        },

        setStateForAll = function () {
            var countOfSelectedItems = getValue().length,
                totalOptionsToSelect = om.find("option").length,
                checkboxForAll = fmParent.find("[data-special=all] input[type=checkbox]");

            checkboxForAll.attr("checked", countOfSelectedItems === totalOptionsToSelect);
        },

        toggleSelectAllItems = function () {
            var shouldSelectAll = getValue().length !== om.find("option").length;

            $.each(om.find("option"), function (i, e) {
                $(e)[0].selected = shouldSelectAll;
            });

            refresh();
        },

        updateButtonText = function () {
            var countOfSelectedOptions = getValue().length,
                buttonLabel = fmParent.find(".faded-multiselect-button-text"),
                selectedOptionText;

            if (!countOfSelectedOptions) {
                buttonLabel.text(labels.noneSelected);
            } else if (countOfSelectedOptions === om.find("option").length) {
                buttonLabel.text(labels.allSelected);
            } else if (countOfSelectedOptions === 1) {
                selectedOptionText = om.find("option[value=" + getValue()[0] + "]").text();
                buttonLabel.text(selectedOptionText);
            } else {
                buttonLabel.text(countOfSelectedOptions + " " + labels.selected);
            }
        };

    options = options || {};
    init();

    return {
        init: init,
        refresh: refresh,
        destroy: destroy,
        getValue: getValue
    };
};
