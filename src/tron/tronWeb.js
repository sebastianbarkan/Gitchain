import TronWeb from 'tronweb';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('https://api.shasta.trongrid.io'); // Full node HTTP endpoint
const solidityNode = new HttpProvider('https://api.shasta.trongrid.io'); // Solidity node HTTP endpoint
const eventServer = 'https://api.shasta.trongrid.io'; // Event server endpoint

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
);

export default tronWeb;
