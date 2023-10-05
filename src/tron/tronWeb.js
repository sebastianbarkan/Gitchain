import TronWeb from 'tronweb';

let tronWeb;

// Check if TronLink has injected window.tronWeb
if (window.tronWeb) {
    tronWeb = window.tronWeb;
} else {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider('https://api.shasta.trongrid.io');  // Full node HTTP endpoint
    const solidityNode = new HttpProvider('https://api.shasta.trongrid.io');  // Solidity node HTTP endpoint
    const eventServer = 'https://api.shasta.trongrid.io';  // Event server endpoint

    tronWeb = new TronWeb(
        fullNode,
        solidityNode,
        eventServer,
    );

    console.error('TronLink not found!');
}

export default tronWeb;
