const { spawn } = require('child_process');
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


  // Python command line invocation
  const pythonProcess = spawn('python', ['./inference/inference.py', '-c', './inference/config.json', '-r', './inference/examples/ao1_MV1_MP3.mp3', '-i', './storage/audio.wav']);
  pythonProcess.stdout.on('data', (data) => {
    const result = data.toString();
    const [pinyin, tone, score] = result.split('\n').slice(1, 4).map(x => x.split(': ')[1]);
    res.send({
      pinyin,
      tone,
      score: +score
    });
  });
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  pythonProcess.on('close', code => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost: ${port}`);
});