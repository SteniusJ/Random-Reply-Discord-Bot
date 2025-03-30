//Lists all game messages in chat
module.exports = async (interaction) => {
    if (Math.random() > 0.5) {
        interaction.reply('Gregs');
    } else {
        interaction.reply('Tails');
    }
}