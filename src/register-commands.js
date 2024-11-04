/**
 * This file is for setting up slash commands on a server.
 * 
 * Running this file once after updating config.json will add slash commands to the server.
 * This file has to be ran again when it is updated.
 */

const config = require("../config.json");
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: "addreply",
        description: "Adds reply to DB",
        options: [
            {
                name: "message-content",
                description: "Message contents that are added to DB, can be GIF/image links",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "addreaction",
        description: "Adds reaction emoji to DB",
        options: [
            {
                name: "react-emoji",
                description: "Emoji used for reactions",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "listreplies",
        description: "Lists all replies currently in DB"
    },
    {
        name: "listreactions",
        description: "Lists all reactions currently in DB"
    },
    {
        name: "removereply",
        description: "Removes reply with specified id",
        options: [
            {
                name: "reply-id",
                description: "id of reply",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: "removereaction",
        description: "Removes reaction with specified id",
        options: [
            {
                name: "reaction-id",
                description: "id of reaction",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: "game",
        description: "Sends random gif/image/message from db",
    },
    {
        name: "addgame",
        description: "Adds \"hop on\" message to DB",
        options: [
            {
                name: "game-message",
                description: "Game message contents that are added to DB, can be GIF/image links",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "listgame",
        description: "Lists all game messages currently in DB",
    },
    {
        name: "removegame",
        description: "Removes game message with specified id",
        options: [
            {
                name: "game-id",
                description: "id of game message",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
];

const rest = new REST({ version: "10" }).setToken(config.token);

//Registers commands in server
(async () => {
    try {
        console.log("registering commands");

        await rest.put(
            Routes.applicationGuildCommands(config.clientid, config.guildid),
            { body: commands }
        );

        console.log("commands registered successfully");
    } catch (error) {
        console.log("There was a error: " + error)
    }
})();