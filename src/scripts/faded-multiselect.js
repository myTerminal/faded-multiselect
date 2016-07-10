var FadedMultiselect = function (elementSelector) {
    var originalMultiselect = $(elementSelector).first(),
        optionTemplate = "<div class='faded-multiselect-dropdown-option'><input type='checkbox'><span>Dummy Text</span></div>",
        fadedMultiselectParent,

        init = function () {
            fadedMultiselectParent = $("<div class='faded-multiselect'><button class='faded-multiselect-button'>Select</button><div class='faded-multiselect-dropdown'></div><div class='original-multiselect'></div></div>");
            
            originalMultiselect = originalMultiselect.replaceWith(fadedMultiselectParent);

            fadedMultiselectParent.find(".original-multiselect").append(originalMultiselect);

            copyItemsFromSelect();
            
            fadedMultiselectParent.find(".faded-multiselect-button").bind("click", function () {
                $(this).closest(".faded-multiselect").toggleClass("open");
            });
        },

        clearItems = function () {
            fadedMultiselectParent.find(".faded-multiselect-dropdown").html("");
        },

        copyItemsFromSelect = function () {
            clearItems();
            
            $.each(originalMultiselect.find("option"), function (i, e) {
                var newOption = $(optionTemplate),
                    oldOption = $(e);

                newOption.find("span").html(oldOption.html());
                newOption.attr("data-value", oldOption.val());
                fadedMultiselectParent.find(".faded-multiselect-dropdown").append(newOption);
            });            
        },

        copyStateFromSelect = function () {
            
        },

        lastItem = function () {
            
        };

        init();

    return {
        init: init
    };
};
