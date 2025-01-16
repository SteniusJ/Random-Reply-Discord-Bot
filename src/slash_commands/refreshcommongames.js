const findCommonGames = require("../functions/findCommonGames");
const config = require('../../config.json');

module.exports = async (con, interaction) => {
    const userIds = interaction.options.get('steam-ids').value.split(",");

    findCommonGames(config, userIds);

    interaction.reply("List refreshed");
}