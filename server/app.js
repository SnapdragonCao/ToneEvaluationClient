const { spawn } = require('child_process');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createAudioFile } = require('simple-tts-mp3');
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
  const target = {...req.body};
  console.log('Received target:', target);
  // Create audio file
  const targetPath = './storage/target';
  createAudioFile(target.character, targetPath, 'zh');

  // Python command line invocation
  const pythonProcess = spawn('python', [ '-W', 'ignore', './inference/inference.py', '-r', targetPath + '.mp3', '-i', './storage/audio.wav', '-c', './configs/config.json']);
  pythonProcess.stdout.on('data', (data) => {
    const result = data.toString();
    const [pinyin, tone, score] = result.split('\n').slice(1, 4).map(x => x.split(': ')[1]);
    console.log( 'Result:\n',{
      pinyin,
      tone,
      score: +score
    })
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

app.get('/getDict', (req, res) => {
  // Server json files
  const pinyins = JSON.parse(fs.readFileSync('./configs/pinyins.json'));
  const tones = JSON.parse(fs.readFileSync('./configs/tones.json'));
  const characters = JSON.parse(fs.readFileSync('./configs/characterDict.json'));

  res.send({
    pinyins: Object.keys(pinyins),
    tones: Object.keys(tones),
    characterDict: characters
  });
  console.log('Sent pinyins and tones.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost: ${port}`);
});