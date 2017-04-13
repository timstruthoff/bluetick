//
//	Sanitizes an input from HTML and blacklisted characters
//
module.exports = (validator) => {
    return (string) => {
        return validator.escape(validator.blacklist(string, '\\[\\]'));
    };
};