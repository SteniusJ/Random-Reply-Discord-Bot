//Removes game message at specified id
module.exports = async (con, interaction) => {
    const query = `
    DELETE FROM
        gameMessages
    WHERE
        id = (?)
`;
    const [result] = await con.query(query, [interaction.options.get('game-id').value]);
    if (result.affectedRows == 0) {
        interaction.reply(
            'ERROR: Given id matches no entry in db'
        );
    } else {
        interaction.reply(
            'Reply: ' + interaction.options.get('game-id').value + ' removed'
        );
    }
}