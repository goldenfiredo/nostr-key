
// generate Aleo account(private key & address) from mnemonic
// compatible with Leo Wallet extension

import bip39 from 'bip39'
import { Account } from '@aleohq/sdk'
import createHmac from 'create-hmac'

const MNEMONIC = '' //write your mnemonic here

let hexSeed = bip39.mnemonicToSeedSync(MNEMONIC).toString('hex')

let index = 0
let path = `m/44'/0'/${index}'/0'`
let { seed, _chainCode } = derivePath(path, hexSeed)

let account = new Account({seed: seed})

let privateKey = account.privateKey()
console.log('Aleo private key: ', privateKey.to_string())
let address = account.address()
console.log('Aleo address: ', address.to_string())

function getMasterSeed(seed) {
  const hmac = createHmac('sha512', 'bls12_377 seed')
  const I = hmac.update(Buffer.from(seed, 'hex')).digest()
  const IL = I.slice(0, 32)
  const IR = I.slice(32)

  return {
      seed: IL,
      chainCode: IR,
  }
}

function CKDPriv({ seed, chainCode }, index) {
  const indexBuffer = Buffer.allocUnsafe(4)
  indexBuffer.writeUInt32BE(index, 0)
  const data = Buffer.concat([Buffer.alloc(1, 0), seed, indexBuffer])
  const I = createHmac('sha512', chainCode)
      .update(data)
      .digest()

  const IL = I.slice(0, 32)
  const IR = I.slice(32)

  return {
      seed: IL,
      chainCode: IR,
  }
}

function replaceDerive(val) {
  return val.replace("'", '')
}

function derivePath(path, rootSeed) {
  const { seed, chainCode } = getMasterSeed(rootSeed)

  const segments = path
      .split('/')
      .slice(1)
      .map(replaceDerive)
      .map(el => parseInt(el, 10))

  return segments.reduce((parentSeeds, segment) => CKDPriv(parentSeeds, segment + 0x80000000), { seed, chainCode })
}
