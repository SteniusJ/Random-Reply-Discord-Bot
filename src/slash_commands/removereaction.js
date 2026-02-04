//Removes reaction at specified id
module.exports = async (dbHost, interaction) => {
    const query = `reactEmojis[${interaction.options.get('reaction-id').value}] remove`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            interaction.reply("failed to remove from db");
            return;
        }
        interaction.reply(`Reaction: ${interaction.options.get('reaction-id').value} removed`);
    });
}