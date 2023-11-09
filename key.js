
import { nip19, getPublicKey } from 'nostr-tools'
import bip39 from 'bip39'
import hdkey from 'hdkey'

const MNEMONIC = '' //write your mnemonic here

let seed = await bip39.mnemonicToSeed(MNEMONIC)
let root = hdkey.fromMasterSeed(seed)

let pri_key = root.derive("m/44'/1237'/0'/0/0")._privateKey
let sk = pri_key.toString("hex")
console.log('sk:', sk)

let nsec = nip19.nsecEncode(sk)
console.log('nostr private key:', nsec)

let pk = getPublicKey(sk)
let npub = nip19.npubEncode(pk)
console.log('nostr public key:', npub)
