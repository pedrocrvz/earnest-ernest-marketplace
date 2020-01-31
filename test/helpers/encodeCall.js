/**
 * Utility function for encoding calls to initialize contracts via proxy.
 * @param name is name of the function to call
 * @param types are tha params types
 * @param rawValues are the input params
 * @returns encoded call
 */
const abi = require('ethereumjs-abi')

module.exports = function encodeCall(name, types = [], rawValues = []) {
  const encodedParameters = abi.rawEncode(types, rawValues).toString('hex')
  const signatureHash = abi.methodID(name, types).toString('hex')
  return `0x${signatureHash}${encodedParameters}`
}
