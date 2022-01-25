# Running App

`npm run build`
`npm run start` or `npm run start-react` without Node.js

# Installing Dependencies

`npm run install`

# Running With/Without Backend

To use mock backend data, simply uncomment the call to `configureFakeBackend()` in `src/index.jsx` which would mock the response for Fetch APIs to different endpoints. User profile data and recommendation data is cached in LocalStorage. 

To run this with a backend server, update the `config.apiUrl` value in `src/services/config.js`