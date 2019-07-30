const server = require("./server");
const port = 4000;

server.listen(port, () =>
  console.log(`\n*** Server running on http://localhost:4000 ***\n`)
);
