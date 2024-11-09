const writeErrorLog = require("../functions/writeErrorLog");

//Removes reaction at specified id
module.exports = (con, interaction) => {
    const query = `
    DELETE FROM
        reactEmojis
    WHERE
        id = (?)
`;
    con.query(
        query,
        [interaction.options.get('reaction-id').value],
        function (err, result) {
            if (result.affectedRows == 0) {
                interaction.reply(
                    'ERROR: Given id matches no entry in db'
                );
            } else if (err) {
                console.error(err);
                interaction.reply(
                    'ERROR: Failed to remove reaction from DB'
                );
                writeErrorLog(err);
            } else {
                interaction.reply(
                    'Reacion: ' +
                    interaction.options.get('reaction-id').value +
                    ' removed'
                );
            }
        }
    );
}