//Removes reply at specified id
module.exports = async (con, interaction) => {
    const query = `
    DELETE FROM
        replyMessages
    WHERE
        id = (?)
`;
    const [result] = await con.query(query, [interaction.options.get('reply-id').value]);
    if (result.affectedRows == 0) {
        interaction.reply(
            'ERROR: Given id matches no entry in db'
        );
    } else {
        interaction.reply(
            'Reply: ' + interaction.options.get('reply-id').value + ' removed'
        );
    }
}