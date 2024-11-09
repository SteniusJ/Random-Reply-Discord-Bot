const writeErrorLog = require("../functions/writeErrorLog");

//Lists all added reactions
module.exports = (con, interaction) => {
    const query = `
    SELECT 
        *
    FROM 
        reactEmojis
`;
    con.query(query, function (err, result) {
        if (err) {
            console.error(err);
            interaction.reply('ERROR: Failed to get list of reactions');
            writeErrorLog(err);
            return;
        }
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
    });
}