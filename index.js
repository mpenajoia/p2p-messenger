const express = require('express');
const Gun = require('gun');
const app = express();
const port = 4000;
// middleware
app.use(Gun.serve);

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
// pass instance of Gun with our server
Gun({ web: server });