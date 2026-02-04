//Removes game message at specified id
module.exports = async (dbHost, interaction) => {
    const query = `gameMessages[${interaction.options.get('game-id').value}] remove`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            interaction.reply("failed to remove from db");
            return;
        }
        interaction.reply(`Reply: ${interaction.options.get('game-id').value} removed`);
    });
}