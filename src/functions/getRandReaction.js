const writeErrorLog = require("./writeErrorLog");

//gets one random reaction from db
module.exports = async (con) => {
    const query = `
        SELECT
            react_emoji
        FROM
            reactEmojis
        ORDER BY
            RAND()
        LIMIT
            1
    `;
    const [result] = await con.query(query);
    return result[0].react_emoji;
}