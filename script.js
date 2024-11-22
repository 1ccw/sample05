let randomNumber = Math.floor(Math.random() * 500) + 1;
        let attempts = 0;
        let maxAttempts = 20;

        document.getElementById('submitGuess').addEventListener('click', function() {
            const guess = Number(document.getElementById('guess').value);
            attempts++;
            let resultText = '';
            let attemptsLeft = maxAttempts - attempts;

            if (guess < 1 || guess > 500) {
                resultText = '1부터 500 사이의 숫자를 입력하세요.';
            } else if (guess > randomNumber) {
                resultText = '더 작은 숫자를 시도해 보세요.';
            } else if (guess < randomNumber) {
                resultText = '더 큰 숫자를 시도해 보세요.';
            } else {
                resultText = `축하합니다! ${attempts}번 만에 맞추셨습니다!`;
                document.getElementById('result').innerText = resultText;
                document.getElementById('attemptsLeft').style.display = 'none';  // 남은 횟수 숨김
                document.getElementById('restart').style.display = 'block';
                document.getElementById('submitGuess').disabled = true;
                return;  // 여기서 함수 종료하여 다른 텍스트가 나타나지 않도록 함
            }

            // 힌트 추가
            if (attempts >= 5 && attempts < 10) {
                resultText += ` \n(힌트 : ${randomNumber.toString().length}자리 숫자입니다.)`;
            } else if (attempts >= 10 && attempts < 15) {
                const lastDigit = randomNumber % 10;
                resultText += ` \n(힌트 : 마지막 자리 숫자는 ${lastDigit}입니다.)`;
            } else if (attempts >= 15 && attempts < 20) {
                const secondDigit = Math.floor((randomNumber % 100) / 10);
                resultText += ` \n(힌트 : 두 번째 자리 숫자는 ${secondDigit}입니다.)`;
            }

            if (attemptsLeft > 0 && resultText.includes('시도해 보세요.')) {
                document.getElementById('result').innerText = resultText;
                document.getElementById('attemptsLeft').innerText = `남은 횟수: ${attemptsLeft}`;
            } else if (attemptsLeft === 0 && !resultText.includes('축하합니다!')) {
                resultText = '모든 횟수를 다 사용했습니다. 다시 시도해 보세요!';
                document.getElementById('restart').style.display = 'block';
                document.getElementById('submitGuess').disabled = true;
                document.getElementById('attemptsLeft').innerText = `남은 횟수: 0`;
            }

            document.getElementById('result').innerText = resultText;
        });

        document.getElementById('restart').addEventListener('click', function() {
            randomNumber = Math.floor(Math.random() * 500) + 1;
            attempts = 0;
            document.getElementById('result').innerText = '';
            document.getElementById('guess').value = '';
            document.getElementById('attemptsLeft').innerText = `남은 횟수: ${maxAttempts}`;
            document.getElementById('attemptsLeft').style.display = 'block';  // 남은 횟수 다시 표시
            document.getElementById('restart').style.display = 'none';
            document.getElementById('submitGuess').disabled = false;
        });

let sensorData = {};
let isCollectingData = false;

// 권한 요청 버튼 클릭 이벤트 추가
document.getElementById('requestPermissionButton').addEventListener('click', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    console.log('Permission granted');
                    window.addEventListener('devicemotion', handleMotionEvent);
                } else {
                    console.error('Permission denied');
                    alert('모션 데이터를 사용하려면 권한을 허용해주세요.');
                }
            })
            .catch(error => console.error('Permission request failed:', error));
    } else {
        console.log('DeviceMotionEvent.requestPermission is not required.');
        window.addEventListener('devicemotion', handleMotionEvent);
    }
});



function handleMotionEvent(event) {
    sensorData.accelerationX = event.accelerationIncludingGravity.x;
    sensorData.accelerationY = event.accelerationIncludingGravity.y;
    sensorData.accelerationZ = event.accelerationIncludingGravity.z;

    sensorData.alpha = event.rotationRate.alpha;
    sensorData.beta = event.rotationRate.beta;
    sensorData.gamma = event.rotationRate.gamma;

    console.log("Acceleration with gravity:", sensorData.accelerationX, sensorData.accelerationY, sensorData.accelerationZ);
    console.log("rotationRate:", sensorData.alpha, sensorData.beta, sensorData.gamma);

    
    if (!isCollectingData) {
        isCollectingData = true;
        sendDataToServer();

        setTimeout(() => {
            isCollectingData = false; // 5초 후 데이터 전송 가능 상태로 전환
        }, 100);
    }
}




// 서버로 데이터를 보내는 함수
function sendDataToServer() {
    fetch('https://48e5-114-70-38-168.ngrok-free.app/api/sensor-data', { // 서버 엔드포인트 URL로 교체
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sensorData), 
        mode: 'cors'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => console.log('Data successfully sent to server:', data))
    .catch(error => console.error('Error sending data to server:', error));
}

const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = "음악 재생";
    } else {
        backgroundMusic.play();
        musicToggle.textContent = "음악 정지";
    }
    isPlaying = !isPlaying;
});


let audioContext = null;
let oscillator = null;
let isPlaying = false;

// 버튼 가져오기
const toggleButton = document.getElementById('sine-toggle');

// 버튼 클릭 이벤트
toggleButton.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isPlaying) {
        // 사인파 정지
        oscillator.stop();
        oscillator = null;
        isPlaying = false;
        toggleButton.textContent = "사인파 재생";
    } else {
        // 사인파 생성 및 재생
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // 사인파
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440Hz (기본값)
        oscillator.connect(audioContext.destination);
        oscillator.start();

        isPlaying = true;
        toggleButton.textContent = "사인파 정지";
    }
});



