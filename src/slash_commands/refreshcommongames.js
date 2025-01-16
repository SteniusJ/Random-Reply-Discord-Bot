const findCommonGames = require("../functions/findCommonGames");

module.exports = async (con, interaction) => {
    const userIds = interaction.options.get('steam-ids').value.split(",");

    findCommonGames(userIds);

    interaction.reply("List refreshed");
}