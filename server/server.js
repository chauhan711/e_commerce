const express = require('express');
const db = require('./db.js');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use('/public', require('./routes/public.route.js'));
app.use('/server', require('./routes/web.route.js'));
app.use('/server/admin',require('./routes/admin.route.js'));
app.use('/server/saler',require('./routes/saler.route.js'));
app.use('/server/user',require('./routes/user.route.js'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});