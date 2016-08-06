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

            var checkboxForAll = getCheckboxForAll();

            if (getValue().length === om.find("option").length) {
                checkboxForAll.attr("checked", true);
            } else if (!getValue().length) {
                checkboxForAll.attr("checked", false);
            }
        },

        saveItemStateToNative = function (item) {
            var itemSpecialTag = $(item).attr("data-special"),
                isItemToSelectAll = itemSpecialTag === "all";

            if (isItemToSelectAll) {
                toggleSelectAllItems();
            } else {
                var value = $(item).attr("data-value"),
                    option = om.find("option[value=" + value + "]")[0];

                option.selected = !option.selected;
            }

            if (options.onStateChange) {
                options.onStateChange(getValue(), itemSpecialTag || value);
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
                totalOptionsToSelect = om.find("option").length;

            getCheckboxForAll().attr("checked",
                                     countOfSelectedItems === totalOptionsToSelect);
        },

        getCheckboxForAll = function () {
            return fmParent.find("[data-special=all] input[type=checkbox]");
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
                selectedOptionText,
                buttonText;

            if (options.buttonText) {
                buttonText = options.buttonText(getValue());
            } else {
                if (!countOfSelectedOptions) {
                    buttonText = labels.noneSelected;
                } else if (countOfSelectedOptions === om.find("option").length) {
                    buttonText = labels.allSelected;
                } else if (countOfSelectedOptions === 1) {
                    selectedOptionText = om.find("option[value=" + getValue()[0] + "]").text();
                    buttonText = selectedOptionText;
                } else {
                    buttonText = countOfSelectedOptions + " " + labels.selected;
                }
            }

            buttonLabel.text(buttonText);
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
