module.exports = (gameMsg) => {
    const i = Math.floor(Math.random() * gameMsg.length);
    return gameMsg[i].game_message;
}