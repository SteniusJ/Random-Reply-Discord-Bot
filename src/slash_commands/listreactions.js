//Lists all added reactions
module.exports = async (con, interaction) => {
    const query = `
    SELECT 
        *
    FROM 
        reactEmojis
`;
    const [result] = await con.query(query);

    //Generates reply string
    var replAr = [];
    var repl = '';
    result.forEach((element) => {
        if (repl.length > 1600) {
            replAr.push(repl);
            repl = '';
        }
        repl +=
            'id: ' +
            element.id +
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