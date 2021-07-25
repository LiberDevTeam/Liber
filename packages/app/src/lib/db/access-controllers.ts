// @ts-nocheck

const { unmarshalSecp256k1PublicKey: unmarshal } =
  require('libp2p-crypto').keys.supportedKeys.secp256k1;
const Buffer = require('safe-buffer').Buffer;

import AccessControllers from 'orbit-db-access-controllers';
import AccessController from 'orbit-db-access-controllers/src/access-controller-interface';

class RecordBasedAccessController extends AccessController {
  static get type() {
    return 'record-based';
  } // Return the type for this controller

  async canAppend(entry, identityProvider) {
    // logic to determine if entry can be added, for example:
    if (!identityProvider.verifyIdentity(entry.identity)) return false;

    const { value, key, op } = entry.payload;

    if (op === 'ADD') return true;

    const [, publicKey, _] = key.split('/');

    const { signature, ...omitted } = value;
    const data = Buffer.from(JSON.stringify(omitted));

    try {
      const pubKey = unmarshal(Buffer.from(publicKey, 'hex'));
      return await pubKey.verify(data, Buffer.from(signature, 'hex'));
    } catch (e) {
      console.error(e);
      // Catch error: sig length wrong
    }

    return false;
  }

  async grant(access, identity) {} // Logic for granting access to identity

  async save() {
    // return parameters needed for loading
    return { parameter: 'some-parameter-needed-for-loading' };
  }

  static async create(orbitdb, options) {
    return new RecordBasedAccessController();
  }
}

AccessControllers.addAccessController({
  AccessController: RecordBasedAccessController,
});

export default AccessControllers;
