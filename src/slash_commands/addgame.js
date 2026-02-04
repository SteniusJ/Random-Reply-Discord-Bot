//Adds game message to db
module.exports = async (dbHost, interaction) => {
    const body = interaction.options.get('game-message').value.replace(",", "\\,");
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
