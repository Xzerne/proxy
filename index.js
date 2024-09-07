const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

app.use((req, res, next) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('USE PARAMETER : "?URL=YOUR_URL" TO USE THIS API');
  }
  
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.origin) {
        proxyReq.setHeader('origin', req.headers.origin);
      }
      if (req.headers['x-requested-with']) {
        proxyReq.setHeader('x-requested-with', req.headers['x-requested-with']);
      }
      proxyReq.removeHeader('cookie');
      proxyReq.removeHeader('cookie2');
    }
  });
  proxy(req, res, next);
});

const port = 3000;
app.listen(port, () => {
  console.log(`PROXY API CURRENTLY RUNNING ON PORT ${port}`);
});

