//Adds game message to db
module.exports = async (con, interaction) => {
    const query = `
    INSERT INTO
        gameMessages
        (game_message)
    VALUE
        (?)
`;
    const [result] = await con.query(query, [interaction.options.get('game-message').value]);

    interaction.reply(
        'Game [' +
        interaction.options.get('game-message').value +
        '] added'
    );
}
