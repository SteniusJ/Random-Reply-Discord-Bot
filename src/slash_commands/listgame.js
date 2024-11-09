//Lists all game messages in chat
module.exports = async (con, interaction) => {
    const query = `
    SELECT 
        *
    FROM 
        gameMessages
`;
    const [result] = await con.query(query);

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