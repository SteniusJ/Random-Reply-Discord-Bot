//adds reply to db
module.exports = async (con, interaction) => {
    const query = `
    INSERT INTO
        replyMessages
        (reply_message)
    VALUE
        (?)
`;
    const [result] = await con.query(query, [interaction.options.get('message-content').value]);

    interaction.reply(
        'Reply [' +
        interaction.options.get('message-content').value +
        '] added'
    );
}