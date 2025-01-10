module.exports = async (gameID) => {
    const url = `https://store.steampowered.com/api/appdetails?appids=${gameID}`;

    const resp = await fetch(url);
    const result = await resp.json();

    let flag = false;

    const keywords = ["Multiplayer", "Multi-player", "Online pvp", "Online Co-op"];

    for (i = 0; i <= result[`${gameID}`].data.categories.length; i++) {
        keywords.forEach(keyword => {
            if (result[`${gameID}`].data.categories[i].description.localeCompare(keyword) === 0) {
                flag = true;
                return
            }
        });
        if (flag) return true
    }
    return false;
}