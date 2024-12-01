module.exports = (app, con, config) => {
    const APIKEY = config.APIKEY;

    app.get("/endpoints", (req, res) => {
        res.send(`
            <h1>GregAPI endpoints: </h1>
            <p>listreplies, listreactions, listgames, addreply, addreaction, addgame, removereply, removereaction, removegame</p>
            <p>Include "APIKEY" in request body for every endpoint and "message" in add endpoints and "id" in remove endpoints</p>
            `)
    })

    /**
     * List Enpoints
     */
    app.post("/listreplies", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
            SELECT
                *
            FROM
                replyMessages
        `;

            const [result] = await con.query(query);
            res.send(result);
        } else {
            res.send(`
                {
                    "error": "wrong API key or API key not provided"
                }
                `);
        }
    })

    app.post("/listreactions", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
            SELECT
                *
            FROM
                reactEmojis
        `;

            const [result] = await con.query(query);
            res.send(result);
        } else {
            res.send(`
                {
                    "error": "wrong API key or API key not provided"
                }
                `);
        }
    })

    app.post("/listgames", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
            SELECT
                *
            FROM
                gameMessages
        `;

            const [result] = await con.query(query);
            res.send(result);
        } else {
            res.send(`
                {
                    "error": "wrong API key or API key not provided"
                }
                `);
        }
    })

    /**
     * Put Enpoints
     */
    app.put("/addreply", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
            INSERT INTO
                replyMessages
                (reply_message)
            VALUE
                (?)
        `;

            const [result] = await con.query(query, [req.body.message]);
            res.send(`
                {
                    "reply": "Added reply, new id: ${result.insertId}"
                }
                `);
        } else {
            res.send(`
                {
                    "error": "wrong API key or API key not provided"
                }
                `);
        }
    })

    app.put("/addreaction", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
            INSERT INTO
                reactEmojis
                (react_emoji)
            VALUE
                (?)
        `;

            const [result] = await con.query(query, [req.body.message]);
            res.send(`
                {
                    "reply": "Added reaction, new id: ${result.insertId}"
                }
                `);
        } else {
            res.send(`
                {
                    "error": "wrong API key or API key not provided"
                }
                `);
        }
    })

    app.put("/addgame", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
            INSERT INTO
                gameMessages
                (game_message)
            VALUE
                (?)
        `;

            const [result] = await con.query(query, [req.body.message]);
            res.send(`
                {
                    "reply": "Added game, new id: ${result.insertId}"
                }
                `);
        } else {
            res.send(`
                {
                    "error": "wrong API key or API key not provided"
                }
                `);
        }
    })

    /**
     * delete Enpoints
     */
    app.delete("/removereply", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
                DELETE FROM
                    replyMessages
                WHERE
                    id = (?)
            `;

            const [result] = await con.query(query, [req.body.id]);

            if (result.affectedRows > 0) {
                res.send(`
                    {
                        "reply": "Removed reply with id: ${req.body.id}"
                    }
                `);
            } else {
                res.send("Reply could not be removed");
            }
        } else {
            res.send(`
                    {
                        "error": "wrong API key or API key not provided"
                    }
                    `);
        }
    })

    app.delete("/removereaction", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
                DELETE FROM
                    reactEmojis
                WHERE
                    id = (?)
            `;

            const [result] = await con.query(query, [req.body.id]);

            if (result.affectedRows > 0) {
                res.send(`
                    {
                        "reply": "Removed reaction with id: ${req.body.id}"
                    }
                `);
            } else {
                res.send("Reaction could not be removed");
            }
        } else {
            res.send(`
                    {
                        "error": "wrong API key or API key not provided"
                    }
                    `);
        }
    })

    app.delete("/removegame", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const query = `
                DELETE FROM
                    gameMessages
                WHERE
                    id = (?)
            `;

            const [result] = await con.query(query, [req.body.id]);

            if (result.affectedRows > 0) {
                res.send(`
                    {
                        "reply": "Removed game with id: ${req.body.id}"
                    }
                `);
            } else {
                res.send("Game could not be removed");
            }
        } else {
            res.send(`
                    {
                        "error": "wrong API key or API key not provided"
                    }
                    `);
        }
    })
}