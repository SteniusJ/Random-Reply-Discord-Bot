//Lists all added reactions
module.exports = async (dbHost, interaction) => {
    const query = `reactEmojis[*]`;

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
        const channelId = interaction.channel;
        channelId.send("failed to get reactions from db");
    }

    //Generates reply string
    var replAr = [];
    var repl = '';
    result.data.forEach((element) => {
        if (repl.length > 1600) {
            replAr.push(repl);
            repl = '';
        }
        repl +=
            'id: ' +
            element.index +
            '\n Message: ' +
            element.react_emoji +
            '\n -------------------------- \n';
    });
    replAr.push(repl);
    const channelId = interaction.channel;
    interaction.reply('All reactions currently in DB: \n');
    replAr.forEach(element => {
        channelId.send(element);
    });
}