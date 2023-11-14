
import bip39 from 'bip39'
import hdkey from 'hdkey'
import { bech32, bech32m } from 'bech32'
import schnorr from 'bip-schnorr'
import ecurve from 'ecurve'

const MNEMONIC = '' //write your mnemonic here

let seed = await bip39.mnemonicToSeed(MNEMONIC)
let root = hdkey.fromMasterSeed(seed)

generate_address("m/86'/0'/0'/0/0")

generate_address("m/86'/0'/0'/1/0")

function generate_address(path) {
  let node = root.derive(path)
  let secp256k1 = ecurve.getCurveByName('secp256k1')
  let pubKey = ecurve.Point.decodeFrom(secp256k1, node._publicKey)
  let taprootPubkey = schnorr.taproot.taprootConstruct(pubKey)

  let words = bech32.toWords(taprootPubkey)
  words.unshift(1)
  let addr = bech32m.encode('bc', words)
  console.log('taproot address: ', addr)
}