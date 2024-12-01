const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require('../config.json');
const mysql = require('mysql2/promise');
const fs = require('node:fs');
const path = require('path');
const getRandReply = require("./functions/getRandReply");
const getRandReaction = require("./functions/getRandReaction");
const writeErrorLog = require("./functions/writeErrorLog");
const setEndpoints = require("./functions/setEndpoints");
const cors = require("cors");

//Chance is calculated like dice, so replyChance = 12, means that there is a 1 in 12 chance for the bot to reply.
const replyChance = 12;
const reactChance = 6;

const port = 3000;
const lengthOfSlashCmdFilePath = 52;

/**
 * DB setup
 */
const con = mysql.createPool({
    host: config.dbhost,
    port: config.dbport,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.defaultdb,
    waitForConnections: true
});

/**
 * Server setup
 */
app.use(cors());
app.use(express.json());

setEndpoints(app, con, config);

server.listen(port, () => {
    console.log('Bot live on *:' + port);
});

/**
 * Discord client setup
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

/**
 * slashcommand files getter
 */
let slashCommands = [];
const slashCommandFiles = fs.readdirSync(config.slash_commands_file_loc, { withFileTypes: true });

for (const file of slashCommandFiles) {
    const filePath = path.join(config.slash_commands_file_loc, file.name);
    let fileName = filePath.substr(lengthOfSlashCmdFilePath);
    fileName = fileName.substr(0, fileName.length - 3)

    slashCommands.push({
        filePath: filePath,
        fileName: fileName
    })
};

//Discord API rejection error handling
process.on('unhandledRejection', (error) => {
    console.error(error);
    writeErrorLog(error);
});

/**
 * React to client messages
 */
client.on('messageCreate', async (message) => {
    //reply to random messages with a random reply from DB
    if (Math.floor(Math.random() * replyChance) == 1 && !message.author.bot) {
        const reply = await getRandReply(con);
        message.reply(reply);
    }
    //react to random messages with a random reaction from DB
    if (Math.floor(Math.random() * reactChance) == 1 && !message.author.bot) {
        const reply = await getRandReaction(con);
        message.react(reply);
    }
});

/**
 * Slash commands
 */
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    for (const slashCommand of slashCommands) {
        if (slashCommand.fileName === interaction.commandName) {
            const slashFunction = require(slashCommand.filePath);
            slashFunction(con, interaction);
        }
    }
});

client.login(config.token);