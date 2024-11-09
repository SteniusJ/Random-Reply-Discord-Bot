const writeErrorLog = require("../functions/writeErrorLog");

//Removes reply at specified id
module.exports = (con, interaction) => {
    const query = `
    DELETE FROM
        replyMessages
    WHERE
        id = (?)
`;
    con.query(
        query,
        [interaction.options.get('reply-id').value],
        function (err, result) {
            if (result.affectedRows == 0) {
                interaction.reply(
                    'ERROR: Given id matches no entry in db'
                );
            } else if (err) {
                console.error(err);
                interaction.reply(
                    'ERROR: Failed to remove reply from DB'
                );
                writeErrorLog(err);
            } else {
                interaction.reply(
                    'Reply: ' + interaction.options.get('reply-id').value + ' removed'
                );
            }
        }
    );
}