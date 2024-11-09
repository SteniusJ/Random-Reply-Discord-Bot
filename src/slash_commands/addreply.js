const writeErrorLog = require("../functions/writeErrorLog");

//adds reply to db
module.exports = (con, interaction) => {
    const query = `
    INSERT INTO
        replyMessages
        (reply_message)
    VALUE
        (?)
`;
    con.query(
        query,
        [interaction.options.get('message-content').value],
        function (err, result) {
            if (err) {
                console.error(err);
                writeErrorLog(err);
                interaction.reply('ERROR: Failed to add reply');
                return;
            }
            interaction.reply(
                'Reply [' +
                interaction.options.get('message-content').value +
                '] added'
            );
        }
    );
}