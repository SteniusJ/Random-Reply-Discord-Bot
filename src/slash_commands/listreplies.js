//Lists all added replies
module.exports = async (dbHost, interaction) => {
    const query = `replyMessages[*]`;

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
        channelId.send("failed to get replies from db");
    }

    //Generates reply string
    var replAr = [];
    var repl = '';
    result.data.forEach((element) => {
        if (repl.length > 1400) {
            replAr.push(repl);
            repl = '';
        }
        repl +=
            'id: ' +
            element.id +
            '\n Message: ' +
            element.reply_message +
            '\n -------------------------- \n';
    });
    replAr.push(repl);
    const channelId = interaction.channel;
    interaction.reply('All replies currently in DB: \n');
    replAr.forEach(element => {
        channelId.send(element);
    });
}