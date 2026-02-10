const dbEntrySanitize = require("../functions/dbEntrySanitize");

//Adds game message to db
module.exports = async (dbHost, interaction) => {
    const body = dbEntrySanitize(interaction.options.get('game-message').value);
    const query = `gameMessages[*] write ${body}`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            interaction.reply("game message add failed!");
            return;
        }
        interaction.reply(
            'Game [' +
            interaction.options.get('game-message').value +
            '] added'
        );
    });
}
