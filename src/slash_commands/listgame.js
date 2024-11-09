const writeErrorLog = require("../functions/writeErrorLog");

//Lists all game messages in chat
module.exports = (con, interaction) => {
    const query = `
    SELECT 
        *
    FROM 
        gameMessages
`;
    con.query(query, function (err, result) {
        if (err) {
            console.error(err);
            interaction.reply('ERROR: Failed to get list of game messages');
            writeErrorLog(err);
            return;
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
    });
}