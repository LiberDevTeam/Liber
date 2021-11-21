const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { commonConfig } = require('./config');

const PORT = 3000;
const HTTP_PORT = PORT + 1;

require('esbuild')
  .serve(
    { servedir: path.join(__dirname, '../public'), port: HTTP_PORT },
    { ...commonConfig, sourcemap: true }
  )
  .then((result) => {
    console.log(`Run server at https://localhost:${PORT}`);
    console.log(`Run server at http://localhost:${HTTP_PORT}`);
    console.log(result);

    // The result tells us where esbuild's local server is
    const { host, port } = result;
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'server_key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'server_cert.pem')),
    };

    const listener = (req, res) => {
      const forwardRequest = (path) => {
        const options = {
          hostname: host,
          port,
          path,
          method: req.method,
          headers: req.headers,
        };

        const proxyReq = http.request(options, (proxyRes) => {
          console.log(proxyRes.statusCode, path);
          if (proxyRes.statusCode === 404) {
            // If esbuild 404s the request, assume it's a route needing to
            // be handled by the JS bundle, so forward a second attempt to `/`.
            return forwardRequest('/');
          }

          // Otherwise esbuild handled it like a champ, so proxy the response back.
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });
      };

      // When we're called pass the request right through to esbuild.
      forwardRequest(req.url);
    };

    // Then start a proxy server on port 3000
    https.createServer(options, listener).listen(PORT);
    http.createServer(options, listener).listen(HTTP_PORT);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
