This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## LiberToken & LiberMarket (Smartcontract, Solidity)

### Relational Libraries

- Truffle https://www.trufflesuite.com/docs/truffle/overview
- Ganache https://www.trufflesuite.com/docs/ganache/overview
- Typechain https://github.com/ethereum-ts/TypeChain
- Solidity(0.8.0) https://docs.soliditylang.org/en/v0.8.0/
- OpenZeppelin https://docs.openzeppelin.com/contracts/4.x/

### Develop Start

1. (First time only)run `yarn install`

Solidity libraries install from npm.

1a. (run with yarn install) run `yarn build:types`

2. run `docker compose up -d` (use ganache service only)

Ganache cli will be runnning. This is private local blockchain.

3. Look at log. run `docker compose logs ganache` or docker GUI

Private chain accounts private key is displayed in log.

4. Import private chain's account in your wallet.

Please check your wallet help.

5. run `yarn migrate`

Solidity files compile and run

Complete! Lets start developping!
