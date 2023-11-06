const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: 'storage/',
  filename: function (req, file, cb) {
    cb(null, "audio.wav");
  }
});
const upload = multer({ storage: storage });

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/inference', upload.single('file'), (req, res) => {
  // const audioBuffer = req.file.buffer;
  console.log('received');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost: ${port}`);
});