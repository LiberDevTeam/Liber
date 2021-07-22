// @ts-nocheck

import AccessControllers from 'orbit-db-access-controllers';
import AccessController from 'orbit-db-access-controllers/src/access-controller-interface';

class RecordBasedAccessController extends AccessController {
  static get type() {
    return 'record-based';
  } // Return the type for this controller

  async canAppend(entry, identityProvider) {
    console.log(entry);
    console.log(identityProvider);
    // logic to determine if entry can be added, for example:
    if (identityProvider.verifyIdentity(entry.identity)) return true;

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
