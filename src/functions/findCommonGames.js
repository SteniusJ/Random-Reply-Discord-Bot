const getSteamLibrary = require("./getSteamLibrary");
const isMultiplayer = require("./isMultiplayer");
const fs = require("fs");

module.exports = async (config, steamIDs) => {
    let userGames = [];
    let commonGames = [];
    let x = 0;

    for (let i = 0; i < steamIDs.length; i++) {
        games = await getSteamLibrary(config, steamIDs[i]);

        for (let i = 0; i < games.length - 1; i++) {
            if (i == 0) {
                userGames.push([])
            }
            userGames[x][i] = { name: games[i].name, steamID: games[i].appid };
        }
        x++;
    }

    let duplicates = [];

    for (let i = 0; i < steamIDs.length; i++) {
        for (let x = 0; x < userGames[i].length; x++) {
            if (i == 0) duplicates.push({ name: userGames[i][x].name, steamID: userGames[i][x].steamID, count: 1 });
            else {
                for (let y = 0; y < duplicates.length; y++) {
                    if (duplicates[y].name == userGames[i][x].name) {
                        duplicates[y].count += 1;
                    }
                }
            }
        }
    }

    for (let i = 0; i < duplicates.length; i++) {
        if (duplicates[i].count >= steamIDs.length) {
            commonGames.push({ name: duplicates[i].name, steamID: duplicates[i].steamID });
        }
    }

    let multiplayerGames = [];

    for (let i = 0; i < commonGames.length; i++) {
        if (isMultiplayer(commonGames[i].steamID)) {
            multiplayerGames.push(commonGames[i].name);
        }
    }

    console.log(multiplayerGames);

    fs.writeFile('./game_cache.json', JSON.stringify(multiplayerGames), { flag: 'w' }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('game cache added');
        }
    });
}