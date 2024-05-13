const express = require('express')
const { execSync } = require('child_process');
const path = require('path');
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const port = 3000
const tasks = {
    1: 'checkData.js',
    2: 'deleteZaloCache.js',
    3: 'changeFontSize.js',
};
const tasksPath = path.join(__dirname,'tasks');


app.post('/automate', async (req, res) => {
  const { udid, serviceId, arguments: args } = req.body; // Destructure request body

  if (!tasks.hasOwnProperty(serviceId)) {
    return res.status(404).send('No serviceId found!');
  }

  const taskFile = tasks[serviceId];
  const autoTasks = path.join(tasksPath, taskFile);

  try {
    execSync(`node ${autoTasks} ${udid} ${args}`);
    res.status(200).send('File executed successfully.');
  } catch (error) {
    console.error(`Error executing file: ${error.message}`);
    res.status(500).send('Error executing file.');
  }
});
    // console.log(req.body);
    // res.status(200).send(req.body);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});