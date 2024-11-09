//adds reaction to db
module.exports = async (con, interaction) => {
    const query = `
    INSERT INTO
        reactEmojis
        (react_emoji)
    VALUE
        (?)
`;
    const [result] = await con.query(query, [interaction.options.get('react-emoji').value]);

    interaction.reply(
        'Reaction [' +
        interaction.options.get('react-emoji').value +
        '] added'
    );
}