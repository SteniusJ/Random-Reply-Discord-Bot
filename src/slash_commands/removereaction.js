//Removes reaction at specified id
module.exports = async (con, interaction) => {
    const query = `
    DELETE FROM
        reactEmojis
    WHERE
        id = (?)
`;
    const [result] = await con.query(query, [interaction.options.get('reaction-id').value]);

    if (result.affectedRows == 0) {
        interaction.reply(
            'ERROR: Given id matches no entry in db'
        );
    } else {
        interaction.reply(
            'Reacion: ' +
            interaction.options.get('reaction-id').value +
            ' removed'
        );
    }
}