const dbEntrySanitize = require("../functions/dbEntrySanitize");

//adds reply to db
module.exports = async (dbHost, interaction) => {
    const body = dbEntrySanitize(interaction.options.get('message-content').value);
    const query = `replyMessages[*] write ${body}`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            interaction.reply("reply message add failed!");
            return;
        }
        interaction.reply(
            'Reply [' +
            interaction.options.get('message-content').value +
            '] added'
        );
    });
}