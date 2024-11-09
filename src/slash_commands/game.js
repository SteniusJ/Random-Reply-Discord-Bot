const getRandGame = require("../functions/getRandGame");
const writeErrorLog = require("../functions/writeErrorLog");

//For sending "hop on" messages in chat
module.exports = async (con, interaction) => {
    const query = `
        SELECT 
            *
        FROM 
            gameMessages
    `;
    const [result] = await con.query(query);
    gameMsg = result;
    interaction.reply(getRandGame(gameMsg));
}
