const writeErrorLog = require("../functions/writeErrorLog");

//Adds game message to db
module.exports = (con, interaction) => {
    const query = `
    INSERT INTO
        gameMessages
        (game_message)
    VALUE
        (?)
`;
    con.query(
        query,
        [interaction.options.get('game-message').value],
        function (err) {
            if (err) {
                console.error(err);
                writeErrorLog(err);
                interaction.reply('ERROR: Failed to add game');
                return;
            }
            interaction.reply(
                'Game [' +
                interaction.options.get('game-message').value +
                '] added'
            );
        }
    );
}
