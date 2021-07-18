const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { commonConfig } = require('./config');

const PORT = 3000;

require('esbuild')
  .serve(
    { servedir: path.join(__dirname, '../public'), port: PORT + 1 },
    { ...commonConfig, sourcemap: true }
  )
  .then((result) => {
    console.log(`Run server at https://localhost:${PORT}`);
    console.log(`Run server at http://localhost:${PORT + 1}`);
    console.log(result);

    // The result tells us where esbuild's local server is
    const { host, port } = result;
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'server_key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'server_cert.pem')),
    };

    // Then start a proxy server on port 3000
    https
      .createServer(options, (req, res) => {
        const options = {
          hostname: host,
          port: port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };

        // Forward each incoming request to esbuild
        const proxyReq = http.request(options, (proxyRes) => {
          // If esbuild returns "not found", send a custom 404 page
          if (proxyRes.statusCode === 404) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>A custom 404 page</h1>');
            return;
          }

          // Otherwise, forward the response from esbuild to the client
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        });

        // Forward the body of the request to esbuild
        req.pipe(proxyReq, { end: true });
      })
      .listen(PORT);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
