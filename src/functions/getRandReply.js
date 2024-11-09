const writeErrorLog = require("./writeErrorLog");

//gets one random reply from db
module.exports = async (con) => {
    let reply;
    const query = `
        SELECT
            reply_message
        FROM
            replyMessages
        ORDER BY
            RAND()
        LIMIT
            1
    `;
    const [result] = await con.query(query);
    return result[0].reply_message;
}