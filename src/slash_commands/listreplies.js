//Lists all added replies
module.exports = async (con, interaction) => {
    const query = `
    SELECT 
        *
    FROM 
        replyMessages
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