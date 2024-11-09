const writeErrorLog = require("../functions/writeErrorLog");

//Lists all added replies
module.exports = (con, interaction) => {
    const query = `
    SELECT 
        *
    FROM 
        replyMessages
`;
    con.query(query, function (err, result) {
        if (err) {
            console.error(err);
            interaction.reply('ERROR: Failed to get list of replies');
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
                element.reply_message +
                '\n -------------------------- \n';
        });
        replAr.push(repl);
        const channelId = interaction.channel;
        interaction.reply('All replies currently in DB: \n');
        replAr.forEach(element => {
            channelId.send(element);
        });
    });
}