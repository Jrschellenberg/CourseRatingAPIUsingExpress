const server = require("./app");

let dataBaseFinishSeed = false;

server.on('appStarted', () => {
	dataBaseFinishSeed = true;
});

export {dataBaseFinishSeed}