const writeErrorLog = require("./writeErrorLog");

//gets one random reply from db
module.exports = async (dbHost) => {
    const query = "replyMessages[*] random 1";
    const result = await fetch(dbHost, {
        method: "POST",
        body: query,
    }).then(res => {
        if (!res.ok) {
            return null;
        }
        return res.json();
    });
    if (result === null) {
        return;
    }
    return result.data[0].reply_message;
}