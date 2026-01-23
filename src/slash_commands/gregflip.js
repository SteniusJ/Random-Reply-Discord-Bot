//Simulates coinflip
module.exports = async (con, interaction) => {
    if (Math.random() > 0.5) {
        interaction.reply('Gregs');
    } else {
        interaction.reply('Tails');
    }
}
