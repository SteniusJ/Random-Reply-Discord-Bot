const getSteamLibrary = require("./getSteamLibrary");
const isMultiplayer = require("./isMultiplayer");
const fs = require("fs");

module.exports = async (config, steamIDs) => {
    let userGames = [];
    let commonGames = [];

    for (let x = 0; x < steamIDs.length; x++) {
        games = await getSteamLibrary(config, steamIDs[x]);

        for (let i = 0; i < games.length - 1; i++) {
            if (i == 0) {
                userGames.push([])
            }
            userGames[x][i] = { name: games[i].name, steamID: games[i].appid };
        }
    }

    let duplicates = [];

    //Loop through every user
    for (let i = 0; i < steamIDs.length; i++) {
        //Loop through every game of every user
        for (let x = 0; x < userGames[i].length; x++) {
            //push all games of first user to duplicates
            if (i == 0) duplicates.push({ name: userGames[i][x].name, steamID: userGames[i][x].steamID, count: 1 });
            else {
                //loop through duplicates to find all games that appear multiple times.
                for (let y = 0; y < duplicates.length; y++) {
                    if (duplicates[y].name == userGames[i][x].name) {
                        duplicates[y].count += 1;
                    }
                }
            }
        }
    }

    //If game is duplicate equal to amount of users push to common games
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

    fs.writeFile('./game_cache.json', JSON.stringify(multiplayerGames), { flag: 'w' }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('game cache added');
        }
    });
}