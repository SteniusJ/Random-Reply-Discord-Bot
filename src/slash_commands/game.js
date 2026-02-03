const writeErrorLog = require("../functions/writeErrorLog");

//For sending "hop on" messages in chat
module.exports = async (dbHost, interaction) => {
    const query = "gameMessages[*] random 1";
    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            return null;
        }
        return res.json();
    });
    if (result === null) {
        interaction.reply("database error");
    }
    interaction.reply(result.data[0].game_message);
}
