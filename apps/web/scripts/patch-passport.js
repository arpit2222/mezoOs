const fs = require('fs');
const path = require('path');

const content = `import { mezo as mezoMainnet, mezoTestnet } from "viem/chains";
export { mezoMainnet, mezoTestnet };
export const CHAIN_ID = {
    testnet: mezoTestnet.id,
    mainnet: mezoMainnet.id,
};
export const RPC_BY_NETWORK = {
    mainnet: {
        http: mezoMainnet.rpcUrls.default.http[0],
        webSocket: mezoMainnet.rpcUrls.default.webSocket?.[0],
    },
    testnet: {
        http: mezoTestnet.rpcUrls.default.http[0],
        webSocket: mezoTestnet.rpcUrls.default.webSocket?.[0],
    },
};
//# sourceMappingURL=constants.js.map`;

function patch(filePath) {
    if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log('Successfully patched:', filePath);
    }
}

// Check apps/web/node_modules
patch(path.join(__dirname, '../node_modules/@mezo-org/passport/dist/src/constants.js'));

// Check root node_modules
patch(path.join(__dirname, '../../../node_modules/@mezo-org/passport/dist/src/constants.js'));

function patchOrangekit(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(
            /"@mezo-org\/orangekit-smart-account\/src\/lib\/utils\/chains"/g,
            '"@mezo-org/orangekit-smart-account/dist/src/lib/utils/chains"'
        );
        fs.writeFileSync(filePath, content);
        console.log('Successfully patched orangekit:', filePath);
    }
}

patchOrangekit(path.join(__dirname, '../node_modules/@mezo-org/orangekit/dist/src/wallet/index.js'));
patchOrangekit(path.join(__dirname, '../../../node_modules/@mezo-org/orangekit/dist/src/wallet/index.js'));
