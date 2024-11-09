const fs = require("fs");
const { stringify } = require('querystring');

module.exports = (error) => {
    const errLog = "\n" + Date() + "\n" + stringify(error) + "\n---------------------------";
    fs.writeFile('./error_logs.txt', errLog, { flag: 'a' }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Error log added');
        }
    });
}