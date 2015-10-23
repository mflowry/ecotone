var customValidators = {
    isCustomAllowedText: function(value) {
        var reg = new RegExp("^[0-9a-zA-Z\' .,?!\/-]+$");
        return value.match(reg) != null
    }

};

module.exports = customValidators;