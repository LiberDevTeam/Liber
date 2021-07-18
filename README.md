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

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Shared DB

```
feeds OrbitDBAddress {
root: 'zdpuAtd6UwmbbQBmYUXBPEtWELnfmikSRwBeopW8wsjB1Crz5',
path: 'feeds'
}
explore/places OrbitDBAddress {
root: 'zdpuArRZQyEHHEm6JHT5GkEF3ESVYGJ31jbE8ahVzbHDUX6QY',
path: 'explore/places'
}
marketplace/bots OrbitDBAddress {
root: 'zdpuAtvSgGR5Y1amv3viEUyUr3Zuf6hzJd1KvPQJVeQfcTY5m',
path: 'marketplace/bots'
}
explore/messages OrbitDBAddress {
root: 'zdpuAyatYt9qV41rwVy85VAB3xb66fPXny4uuH7rPYqWrzEgz',
path: 'explore/messages'
}
marketplace/stickers OrbitDBAddress {
root: 'zdpuAszVyTNEebdF5Q2StXxswo4sMXjuXtL7sCvbCaxXovJy7',
path: 'marketplace/stickers'
}
```

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
