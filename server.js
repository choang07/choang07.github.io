// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.route('/api')
  .get((req, res) => {
    console.log('GET request detected');
  })
  .post((req, res) => {
    console.log('POST request detected');
<<<<<<< HEAD
    res.send("Hello World");
=======
    console.log('Form data in res.body', req.body);
>>>>>>> d7d1d5f73fbecc8a24117ffeaa14d309aab9d080
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
