const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require('../config.json');
const mysql = require('mysql2');
const fs = require('node:fs');
const { stringify } = require('querystring');
const { channel } = require('diagnostics_channel');

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
    console.log('GregBot live on *:' + port);
});

/**
 * DB setup
 */
const con = mysql.createConnection({
    host: config.dbhost,
    port: config.dbport,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.defaultdb,
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

/**
 * Reply and reaction getters
 */
const getReplies = () => {
    con.query(
        `
        SELECT 
            *
        FROM 
            replyMessages
    `,
        function (err, result, fields) {
            if (err) throw err;
            replies = result;
        }
    );
};

const getReactions = () => {
    con.query(
        `
        SELECT 
            *
        FROM 
            reactEmojis
    `,
        function (err, result, fields) {
            if (err) throw err;
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
 * Reply and reaction getters
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
                try {
                    if (err) throw err;
                    interaction.reply(
                        'Reply [' +
                        interaction.options.get('message-content').value +
                        '] added'
                    );
                    getReplies();
                } catch (error) {
                    console.error(error);
                    interaction.reply('ERROR: Failed to add reply');
                    writeErrorLog(error);
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
                try {
                    if (err) throw err;
                    interaction.reply(
                        'Reaction [' +
                        interaction.options.get('react-emoji').value +
                        '] added'
                    );
                    getReactions();
                } catch (error) {
                    console.error(error);
                    interaction.reply('ERROR: Failed to add reaction');
                    writeErrorLog(error);
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
            try {
                if (err) throw err;

                //Generates reply string
                var replAr = [];
                var repl = '';
                result.forEach((element) => {
                    if (repl.length > 1800) {
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
                if (replAr.length < 1) { replAr.push(repl) };
                const channelId = interaction.channel;
                replAr.forEach(element => {
                    channelId.send('All replies currently in DB: \n' + element)
                });
            } catch (error) {
                console.error(error);
                interaction.reply('ERROR: Failed to get list of replies');
                writeErrorLog(error);
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
            try {
                if (err) throw err;

                //Generates reply string
                var replAr = [];
                var repl = '';
                result.forEach((element) => {
                    if (repl.length > 1800) {
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
                if (replAr.length < 1) { replAr.push(repl) };
                const channelId = interaction.channel;
                replAr.forEach(element => {
                    channelId.send('All replies currently in DB: \n' + element)
                });
            } catch (error) {
                console.error(error);
                interaction.reply('ERROR: Failed to get list of reactions');
                writeErrorLog(error);
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
                try {
                    if (err) throw err;
                    if (result.affectedRows == 0) throw error;
                    interaction.reply(
                        'Reply: ' + interaction.options.get('reply-id').value + ' removed'
                    );
                    getReplies();
                } catch (error) {
                    console.error(error);
                    interaction.reply(
                        'ERROR: Failed to remove reply from DB, check that id matches a entry'
                    );
                    writeErrorLog(error);
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
                try {
                    if (err) throw err;
                    if (result.affectedRows == 0) throw error;
                    interaction.reply(
                        'Reacion: ' +
                        interaction.options.get('reaction-id').value +
                        ' removed'
                    );
                    getReactions();
                } catch (error) {
                    console.error(error);
                    interaction.reply(
                        'ERROR: Failed to remove reaction from DB, check that id matches a entry'
                    );
                    writeErrorLog(error);
                }
            }
        );
    }
});

client.login(config.token);
