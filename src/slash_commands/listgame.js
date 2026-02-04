//Lists all game messages in chat
module.exports = async (dbHost, interaction) => {
    const query = `gameMessages[*]`;

    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            return null;
        }
        let response = res.json();
        return response.data;
    });

    if (result === null) {
        const channelId = interaction.channel;
        channelId.send("failed to get game messages from db");
    }

    //Generates reply string
    var replAr = [];
    var repl = '';
    result.forEach((element) => {
        if (repl.length > 1400) {
            replAr.push(repl);
            repl = '';
        }
        repl +=
            'id: ' +
            element.id +
            '\n Message: ' +
            element.game_message +
            '\n -------------------------- \n';
    });
    replAr.push(repl);
    const channelId = interaction.channel;
    interaction.reply('All game messages currently in DB: \n');
    replAr.forEach(element => {
        channelId.send(element);
    });
}