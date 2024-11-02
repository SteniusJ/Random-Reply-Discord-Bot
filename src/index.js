const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require('../config.json');
const mysql = require('mysql2');
const fs = require('node:fs');
const { stringify } = require('querystring');

var replies = [];
var reactions = [];

//Chance is calculated like dice, so replyChance = 12, means that there is a 1 in 12 chance for the bot to reply.
const replyChance = 12;
const reactChance = 6;

const port = 3000;

/**
 * Server setup
 */
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(port, () => {
    console.log('Bot live on *:' + port);
});

/**
 * DB setup
 */
const con = mysql.createPool({
    host: config.dbhost,
    port: config.dbport,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.defaultdb,
});

con.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected!');
    connection.release();
});

/**
 * Reply and reaction getters from DB
 * @argument channel is used for sending messages in channel to inform users of a error. Pass [interaction.channel] in case function is called in response to a interaction.
 */
const getReplies = (channel) => {
    con.query(
        `
        SELECT 
            *
        FROM 
            replyMessages
    `,
        function (err, result, fields) {
            if (err) {
                console.error(err);
                writeErrorLog(err);
                if (channel) {
                    channel.send('ERROR: Failed to fetch replies from DB');
                }
            }
            replies = result;
        }
    );
};

const getReactions = (channel) => {
    con.query(
        `
        SELECT 
            *
        FROM 
            reactEmojis
    `,
        function (err, result, fields) {
            if (err) {
                console.error(err);
                writeErrorLog(err);
                if (channel) {
                    channel.send('ERROR: Failed to fetch reactions from DB');
                }
            }
            reactions = result;
        }
    );
};

getReplies();
getReactions();

/**
 * Error log handling
 */
const writeErrorLog = (error) => {
    const errLog = "\n" + Date() + "\n" + stringify(error) + "\n---------------------------";
    fs.writeFile('./error_logs.txt', errLog, { flag: 'a' }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Error log added');
        }
    });
};

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
 * Random reply / reaction getters
 * @returns reply_message / react_emoji
 */
function getRandReply() {
    const i = Math.floor(Math.random() * replies.length);
    return replies[i].reply_message;
}

function getRandReaction() {
    const i = Math.floor(Math.random() * reactions.length);
    return reactions[i].react_emoji;
}

//Discord API rejection error handling
process.on('unhandledRejection', (error) => {
    console.error(error);
    writeErrorLog(error);
});

/**
 * React to client messages
 */
client.on('messageCreate', (message) => {
    //reply to random messages with a random reply from DB
    if (Math.floor(Math.random() * replyChance) == 1 && !message.author.bot) {
        message.reply(getRandReply());
    }
    //react to random messages with a random reaction from DB
    if (Math.floor(Math.random() * reactChance) == 1 && !message.author.bot) {
        message.react(getRandReaction());
    }
});

/**
 * Slash commands
 */
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    /**
     * MySql database queries
     */

    //Adds reply to DB
    if (interaction.commandName === 'addreply') {
        const query = `
            INSERT INTO
                replyMessages
                (reply_message)
            VALUE
                (?)
        `;
        con.query(
            query,
            [interaction.options.get('message-content').value],
            function (err, result) {
                if (err) {
                    console.error(err);
                    writeErrorLog(err);
                    interaction.reply('ERROR: Failed to add reply');
                } else {
                    interaction.reply(
                        'Reply [' +
                        interaction.options.get('message-content').value +
                        '] added'
                    );
                    getReplies(interaction.channel);
                }
            }
        );
    }

    //Adds reaction to DB
    if (interaction.commandName === 'addreaction') {
        const query = `
            INSERT INTO
                reactEmojis
                (react_emoji)
            VALUE
                (?)
        `;
        con.query(
            query,
            [interaction.options.get('react-emoji').value],
            function (err, result) {
                if (err) {
                    console.error(err);
                    writeErrorLog(err);
                    interaction.reply('ERROR: Failed to add reaction');
                } else {
                    interaction.reply(
                        'Reaction [' +
                        interaction.options.get('react-emoji').value +
                        '] added'
                    );
                    getReactions(interaction.channel);
                }
            }
        );
    }

    //Lists all added replies
    if (interaction.commandName === 'listreplies') {
        const query = `
            SELECT 
                *
            FROM 
                replyMessages
        `;
        con.query(query, function (err, result) {
            if (err) {
                console.error(err);
                interaction.reply('ERROR: Failed to get list of replies');
                writeErrorLog(err);
            } else {
                //Generates reply string
                var replAr = [];
                var repl = '';
                result.forEach((element) => {
                    if (repl.length > 1400) {
                        replAr.push(repl);
                        repl = '';
                    }
                    repl +=
                        'id: ' +
                        element.id +
                        '\n Message: ' +
                        element.reply_message +
                        '\n -------------------------- \n';
                });
                replAr.push(repl);
                const channelId = interaction.channel;
                interaction.reply('All replies currently in DB: \n');
                replAr.forEach(element => {
                    channelId.send(element);
                });
            }
        });
    }

    //Lists all added reactions
    if (interaction.commandName === 'listreactions') {
        const query = `
            SELECT 
                *
            FROM 
                reactEmojis
        `;
        con.query(query, function (err, result) {
            if (err) {
                console.error(err);
                interaction.reply('ERROR: Failed to get list of reactions');
                writeErrorLog(err);
            } else {
                //Generates reply string
                var replAr = [];
                var repl = '';
                result.forEach((element) => {
                    if (repl.length > 1600) {
                        replAr.push(repl);
                        repl = '';
                    }
                    repl +=
                        'id: ' +
                        element.id +
                        '\n Message: ' +
                        element.react_emoji +
                        '\n -------------------------- \n';
                });
                replAr.push(repl);
                const channelId = interaction.channel;
                interaction.reply('All reactions currently in DB: \n');
                replAr.forEach(element => {
                    channelId.send(element);
                });
            }
        });
    }

    //Removes reply at specified id
    if (interaction.commandName === 'removereply') {
        const query = `
            DELETE FROM
                replyMessages
            WHERE
                id = (?)
        `;
        con.query(
            query,
            [interaction.options.get('reply-id').value],
            function (err, result) {
                if (result.affectedRows == 0) {
                    interaction.reply(
                        'ERROR: Given id matches no entry in db'
                    );
                } else if (err) {
                    console.error(err);
                    interaction.reply(
                        'ERROR: Failed to remove reply from DB'
                    );
                    writeErrorLog(err);
                } else {
                    interaction.reply(
                        'Reply: ' + interaction.options.get('reply-id').value + ' removed'
                    );
                    getReplies(interaction.channel);
                }
            }
        );
    }

    //Removes reaction at specified id
    if (interaction.commandName === 'removereaction') {
        const query = `
            DELETE FROM
                reactEmojis
            WHERE
                id = (?)
        `;
        con.query(
            query,
            [interaction.options.get('reaction-id').value],
            function (err, result) {
                if (result.affectedRows == 0) {
                    interaction.reply(
                        'ERROR: Given id matches no entry in db'
                    );
                } else if (err) {
                    console.error(err);
                    interaction.reply(
                        'ERROR: Failed to remove reaction from DB'
                    );
                    writeErrorLog(err);
                } else {
                    interaction.reply(
                        'Reacion: ' +
                        interaction.options.get('reaction-id').value +
                        ' removed'
                    );
                    getReactions(interaction.channel);
                }
            }
        );
    }
});

client.login(config.token);
