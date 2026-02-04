//adds reaction to db
module.exports = async (dbHost, interaction) => {
    const body = interaction.options.get('react-emoji').value.replace(",", "\\,");
    const query = `reactEmojis[*] write ${body}`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            interaction.reply("react emoji add failed!");
            return;
        }
        interaction.reply(
            'Reaction [' +
            interaction.options.get('react-emoji').value +
            '] added'
        );
    });
}