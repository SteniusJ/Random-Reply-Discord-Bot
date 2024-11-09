const writeErrorLog = require("../functions/writeErrorLog");

//adds reaction to db
module.exports = (con, interaction) => {
    const query = `
    INSERT INTO
        reactEmojis
        (react_emoji)
    VALUE
        (?)
`;
    con.query(
        query,
        [interaction.options.get('react-emoji').value],
        function (err, result) {
            if (err) {
                console.error(err);
                writeErrorLog(err);
                interaction.reply('ERROR: Failed to add reaction');
                return;
            }
            interaction.reply(
                'Reaction [' +
                interaction.options.get('react-emoji').value +
                '] added'
            );
        }
    );
}