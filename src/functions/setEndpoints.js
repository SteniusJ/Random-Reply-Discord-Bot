const dbEntrySanitize = require("./dbEntrySanitize");

module.exports = (app, dbHost, config) => {
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
            const query = "replyMessages[*]";

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(res => {
                if (!res.ok) {
                    return `{"error": "database error"}`;
                }
                return res.json();
            });
            res.send(result.data);
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
            const query = "reactEmojis[*]";

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(res => {
                if (!res.ok) {
                    return `{"error": "database error"}`;
                }
                return res.json();
            });
            res.send(result.data);
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
            const query = "gameMessages[*]";

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(res => {
                if (!res.ok) {
                    return `{"error": "database error"}`;
                }
                return res.json();
            });
            res.send(result.data);
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
            const body = dbEntrySanitize(req.body.message);
            const query = `replyMessages[*] write ${body}`;

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(res => {
                if (!res.ok) {
                    return `{"error": "database error"}`;
                }
                return res.json();
            })
            res.send(`
                {
                    "reply": "Added reply: ${result.status}"
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
            const body = dbEntrySanitize(req.body.message);
            const query = `reactEmojis[*] write ${body}`;

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(res => {
                if (!res.ok) {
                    return `{"error": "database error"}`;
                }
                return res.json();
            })
            res.send(`
                {
                    "reply": "Added reaction: ${result.status}"
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
            const body = dbEntrySanitize(req.body.message);
            const query = `gameMessages[*] write ${body}`;

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(res => {
                if (!res.ok) {
                    return `{"error": "database error"}`;
                }
                return res.json();
            })
            res.send(`
                {
                    "reply": "Added game: ${result.status}"
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
            const body = req.body.id;
            const query = `replyMessages[${body}] remove`;

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(response => {
                if (!response.ok) {
                    res.send(`
                        {
                            "error": "Reply could not be removed"
                        }
                    `);
                }
                return response.json();
            })
            res.send(`
                {
                    "reply": "Removed reply with id: ${req.body.id}"
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

    app.delete("/removereaction", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const body = req.body.id;
            const query = `reactEmojis[${body}] remove`;

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(response => {
                if (!response.ok) {
                    res.send(`
                        {
                            "error": "Reaction could not be removed"
                        }
                    `);
                }
                return response.json();
            })
            res.send(`
                {
                    "reply": "Removed reaction with id: ${req.body.id}"
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

    app.delete("/removegame", async (req, res) => {
        if (req.body.APIKEY == APIKEY) {
            const body = req.body.id;
            const query = `gameMessages[${body}] remove`;

            const result = await fetch(dbHost, {
                method: "POST",
                body: query,
            }).then(response => {
                if (!response.ok) {
                    res.send(`
                        {
                            "error": "Game could not be removed"
                        }
                    `);
                }
                return response.json();
            })
            res.send(`
                {
                    "reply": "Removed game with id: ${req.body.id}"
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
}