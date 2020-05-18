const server = require("./api/server");

const Port = process.env.Port || 5000;

server.listen(Port, (req, res) => {
    console.log(`\nRunning on port ${Port} \n`);
})