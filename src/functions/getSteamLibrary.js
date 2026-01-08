module.exports = async (config, steamID) => {
    url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?`;

    resp = await fetch(url + new URLSearchParams({
        key: config.STEAMAPIKEY,
        steamID: steamID,
        include_appinfo: true
    }))

    const json = await resp.json();

    return json.response.games;
}