const { SigningStargateClient, GasPrice, coins } = require("@cosmjs/stargate")
const { Secp256k1HdWallet } = require('@cosmjs/launchpad')

const mnemonic = '' //write your mnemonic here
const rpcEndpoint = ''

async function inscribe(count) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: 'celestia'})
    const [account] = await wallet.getAccounts()
    console.log(account.address)

    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet)
    
    const from = account.address
    const to = from
    const amount = coins(1, "utia")
    const fee = {
        amount: coins(2000, "utia"),
        gas: "100000",
    }

    const memo = 'ZGF0YToseyJvcCI6Im1pbnQiLCJhbXQiOjEwMDAwLCJ0aWNrIjoiY2lhcyIsInAiOiJjaWEtMjAifQ=='

    for (let i = 0; i < count; i++) {
        const tx = await client.sendTokens(from, to, amount, fee, memo)
        console.log(`${i}, hash: https://www.mintscan.io/celestia/tx/${tx.transactionHash}`)
    }
}

async function main() {
    await inscribe(1)
}

main()