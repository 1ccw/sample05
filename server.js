const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Express 설정
const cors = require('cors');
const app = express();


app.use(cors());
app.use(bodyParser.json()); // JSON 형식의 요청 본문을 처리


// 데이터베이스 연결 설정
mongoose.connect('mongodb://localhost:27017/sensorDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// MongoDB 모델 정의
const SensorData = mongoose.model('SensorData', new mongoose.Schema({
    accelerationX: Number,
    accelerationY: Number,
    accelerationZ: Number,
    alpha: Number,
    beta: Number,
    gamma: Number,
    timestamp: { type: Date, default: Date.now }
}));



// 데이터 수신 API
app.post('/api/sensor-data', (req, res) => {
    const data = req.body;

    // 새로운 데이터 인스턴스 생성
    const newSensorData = new SensorData({
        accelerationX: data.accelerationX,
        accelerationY: data.accelerationY,
        accelerationZ: data.accelerationZ,
        alpha: data.alpha,
        beta: data.beta,
        gamma: data.gamma
    });

    // MongoDB에 데이터 저장
    newSensorData.save()
        .then((savedData) => {
            res.status(200).send(savedData);
        })
        .catch((err) => {
            res.status(500).send({ error: 'Failed to save data' });
        });
});

// 서버 시작
const port = process.env.port || 3003;
app.listen(port, '0.0.0.0',() => {
    console.log(`Server running on http://localhost:${port}`);
});
