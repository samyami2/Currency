const express = require('express');
const app = express();

const testRouter = express.Router();
testRouter.get('/', (req, res) => {
  res.json({ works: true });
});

app.use('/test', testRouter);

app.listen(3001, () => console.log('Test server on 3001'));