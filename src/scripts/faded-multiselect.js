var FadedMultiselect = function (elementSelector) {
    var om = $(elementSelector).first(),
        parentTemplate = "" +
            "<div class='faded-multiselect'>" +
            "  <button class='faded-multiselect-button'>" +
            "    Select" +
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
        },

        refresh = function () {
            clearItems();
            copyItemsFromSelect();
            
            fmParent.find(".faded-multiselect-button").bind("click", function () {
                $(this).closest(".faded-multiselect").toggleClass("open");
            });

            fmParent.find(".faded-multiselect-dropdown-option").bind("click", function () {
                var checkbox = $(this).find("input[type=checkbox]");
                checkbox.attr("checked", !checkbox.attr("checked"));
                saveItemStateToNative($(this).attr("data-value"));
            });
        },

        destroy = function () {
            fmParent.replaceWith(om);
        },

        getValue = function () {
            return om.val();
        },

        clearItems = function () {
            fmParent.find(".faded-multiselect-dropdown").html("");
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

        saveItemStateToNative = function (value) {
            var option = om.find("option[value=" + value + "]")[0];
            option.selected = !option.selected;
        };

    init();

    return {
        init: init,
        refresh: refresh,
        destroy: destroy,
        getValue: getValue
    };
};
