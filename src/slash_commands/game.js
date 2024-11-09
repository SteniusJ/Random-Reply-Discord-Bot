const getRandGame = require("../functions/getRandGame");
const writeErrorLog = require("../functions/writeErrorLog");

//For sending "hop on" messages in chat
module.exports = (con, interaction) => {
    con.query(
        `
        SELECT 
            *
        FROM 
            gameMessages
    `,
        function (err, result, fields) {
            if (err) {
                console.error(err);
                writeErrorLog(err);
                interaction.channel.send('ERROR: Failed to fetch gameMessages from DB');
                return;
            }
            gameMsg = result;
            interaction.reply(getRandGame(gameMsg));
        }
    );
}
