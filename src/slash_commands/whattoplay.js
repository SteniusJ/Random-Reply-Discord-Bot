const fs = require("fs");
module.exports = async (con, interaction) => {

    fs.readFile('./game_cache.json', 'utf8', (err, data) => {
        json = JSON.parse(data);
        interaction.reply(json[Math.floor(Math.random() * json.length)]);
    });

}