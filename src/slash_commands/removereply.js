//Removes reply at specified id
module.exports = async (dbHost, interaction) => {
    const query = `replyMessages[${interaction.options.get('reply-id').value}] remove`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            interaction.reply("failed to remove from db");
            return;
        }
        interaction.reply(`Reply: ${interaction.options.get('reply-id').value} removed`);
    });
}