module.exports = (input) => {
    let sanitized_string = "";
    for (ci in input) {
        let char = input[ci];

        switch (char) {
            case ",":
                sanitized_string += "\\" + char;
                break;
            case "|":
                sanitized_string += "\\" + char;
                break;
            default:
                sanitized_string += char;
                break;
        }
    }

    return sanitized_string;
}