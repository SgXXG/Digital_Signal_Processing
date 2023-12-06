const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Хранение данных о сигналах
const signals = [];

// Функция для генерации данных сигнала
function generateSignal(type, amplitude, frequency, phase, N, Dc, t0, t1) {
    const x = [];
    const y = [];
    for (let n = 0; n < N; n++) {
        let value;
        if (type === 'sine') {
            value = amplitude * Math.sin(2 * Math.PI * frequency * n / N + phase);
        } else if (type === 'triangle') {
            value = (2 * amplitude / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * n / N + phase));
        } else if (type === 'sawtooth') {
            value = -(2 * amplitude / Math.PI) * Math.atan(1 / Math.tan(2 * Math.PI * frequency * n / N + phase));
        }
        x.push(n);
        y.push(value);
    }
    return { x, y };
}

// Функция для генерации прямоугольного сигнала
function generateRectangularSignal(amplitude, frequency, Dc, N, T) {
    const x = [];
    const y = [];
    for (let n = 0; n < N; n++) {
        const mod = ((n / N) % (T)) / (T);
        let value;
        if (mod < Dc) {
            value = amplitude;
        } else {
            value = -amplitude;
        }
        x.push(n);
        y.push(value);
    }
    return { x, y };
}

// Функция для генерации белого шума
function generateWhiteNoise(amplitude, N) {
    const x = [];
    const y = [];
    for (let n = 0; n < N; n++) {
        const value = amplitude * (2 * Math.random() - 1);
        x.push(n);
        y.push(value);
    }
    return { x, y };
}

// Функция для генерации полигармонического сигнала
function generatePolyharmonicSignal(amplitude1, frequency1, amplitude2, frequency2, amplitude3, frequency3, N) {
    const signal1 = generateSignal('sine', amplitude1, frequency1, 0, N);
    const signal2 = generateSignal('sine', amplitude2, frequency2, 0, N);
    const signal3 = generateSignal('sine', amplitude3, frequency3, 0, N);

    const x = signal1.x;
    const y = signal1.y.map((value, index) => value + signal2.y[index] + signal3.y[index]);

    return { x, y };
}

// Генерация HTML кода для графика сигнала
function generateSignalHTML(type, signal, amplitude, frequency, N, Dc, T) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${type} сигнал</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-4">
            <h1>${type} сигнал</h1>
            <form class="mb-4">
            ${(type === 'sine' || type === 'triangle' || type === 'sawtooth' || type === 'Синусоидальный' || type === 'Треугольная' || type === 'Пилообразная' || type === 'Белый шум' || type === 'rectangular' || type === 'Прямоугольный') ? `
                <div class="form-group">
                    <label for="amplitude">Амплитуда:</label>
                    <input type="number" class="form-control" id="amplitude" name="amplitude" step="0.1" value="${amplitude}">
                </div>
                <div class="form-group">
                    <label for="frequency">Частота:</label>
                    <input type="number" class="form-control" id="frequency" name="frequency" step="0.1" value="${frequency}">
                </div>
                ` : ''}
                ${(type === 'sine' || type === 'triangle' || type === 'sawtooth' || type === 'Синусоидальный' || type === 'Треугольная' || type === 'Пилообразная' || type === 'Белый шум') ? `
                <div class="form-group">
                    <label for="phase">Начальная фаза:</label>
                    <input type="number" class="form-control" id="phase" name="phase" step="0.1" value="${(type === 'sine' || type === 'triangle' || type === 'sawtooth') ? phase : 0}">
                </div>
                ` : ''}
                ${(type === 'rectangular' || type === 'Прямоугольный') ? `
                <div class="form-group">
                    <label for="Dc">Коэффициент заполнения (Dc):</label>
                    <input type="number" class="form-control" id="Dc" name="Dc" step="0.1" value="${Dc}">
                </div>
                <div class="form-group">
                    <label for="T">Период (T):</label>
                    <input type="number" class="form-control" id="T" name="T" step="0.1" value="${T}">
                </div>
                ` : ''}
                ${(type === 'sine' || type === 'triangle' || type === 'sawtooth' || type === 'Синусоидальный' || type === 'Треугольная' || type === 'Пилообразная' || type === 'Белый шум' || type === 'rectangular' || type === 'Прямоугольный') ? `
                <button type="submit" class="btn btn-primary">Обновить график</button>
                ` : ''}
            </form>
            <div id="plotly-graph"></div>
            <a href="/" class="btn btn-secondary">Назад</a>
            <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
            <script>
                const x = ${JSON.stringify(signal.x)};
                const y = ${JSON.stringify(signal.y)};
                const layout = {
                    title: '${type} сигнал',
                    xaxis: { title: 'Время' },
                    yaxis: { title: 'Амплитуда' },
                };
                Plotly.newPlot('plotly-graph', [{ x, y }], layout);
            </script>
        </div>
    </body>
    </html>
  `;
}

// Генерация главной страницы с ссылками на сигналы
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Главная страница</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body, html {
                height: 100%;
            }
            .container-fluid {
                height: 100%;
            }
            .list-group-item {
                font-size: 20px;
                margin: 10px 0;
            }
            .jumbotron {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
       <div class="container-fluid">
            <div class="row">
                <div class="col-md-8">
                    <div class="jumbotron">
                        <h1>Веб-приложение для генерации и отображения различных видов сигналов.</h1>
                        <p>Выберите один из сигналов ниже, настройте параметры и нажмите "Обновить график", чтобы увидеть результат.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="list-group">
                        <a href="/signals" class="list-group-item list-group-item-action">Просмотр сигналов</a>
                        <a href="/sinusoidal" class="list-group-item list-group-item-action">Синусоидальный сигнал</a>
                        <a href="/rectangular" class="list-group-item list-group-item-action">Прямоугольный сигнал</a>
                        <a href="/triangle" class="list-group-item list-group-item-action">Треугольная волна</a>
                        <a href="/sawtooth" class="list-group-item list-group-item-action">Пилообразная волна</a>
                        <a href="/white-noise" class="list-group-item list-group-item-action">Белый шум</a>
                        <a href="/polyharmonic" class="list-group-item list-group-item-action">Полигармонический сигнал</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Обработка GET-запроса для синусоидального сигнала
app.get('/sinusoidal', (req, res) => {
    const { amplitude = 1, frequency = 1, phase = 0 } = req.query;
    const N = 3000;
    const signal = generateSignal('sine', amplitude, frequency, phase, N);
    const signalName = 'Синусоидальный';
    signals.push({ name: signalName, signal, amplitude, frequency, phase, N });
    res.send(generateSignalHTML(signalName, signal, amplitude, frequency, phase, N, 0, 0));
});

// Обработка GET-запроса для прямоугольного сигнала
app.get('/rectangular', (req, res) => {
    const { amplitude = 1, frequency = 10, Dc = 0.55, T = 0.5 } = req.query;
    const N = 1000;
    const signal = generateRectangularSignal(amplitude, frequency, Dc, N, T);
    const signalName = 'Прямоугольный';
    signals.push({ name: signalName, signal, amplitude, frequency, N, Dc, T });
    res.send(generateSignalHTML(signalName, signal, amplitude, frequency, N, Dc, T));
});

// Обработка GET-запроса для треугольной волны
app.get('/triangle', (req, res) => {
    const { amplitude = 1, frequency = 1, phase = 0 } = req.query;
    const N = 1000;
    const signal = generateSignal('triangle', amplitude, frequency, phase, N);
    const signalName = 'Треугольная';
    signals.push({ name: signalName, signal, amplitude, frequency, phase, N });
    res.send(generateSignalHTML(signalName, signal, amplitude, frequency, phase, N, 0, 0));
});

// Обработка GET-запроса для пилообразной волны
app.get('/sawtooth', (req, res) => {
    const { amplitude = 1, frequency = 1, phase = 0 } = req.query;
    const N = 1000;
    const signal = generateSignal('sawtooth', amplitude, frequency, phase, N);
    const signalName = 'Пилообразная';
    signals.push({ name: signalName, signal, amplitude, frequency, phase, N });
    res.send(generateSignalHTML(signalName, signal, amplitude, frequency, phase, N, 0, 0));
});

// Обработка GET-запроса для белого шума
app.get('/white-noise', (req, res) => {
    const { amplitude = 1, N = 1000 } = req.query;
    const signal = generateWhiteNoise(amplitude, N);
    const signalName = 'Белый шум';
    signals.push({ name: signalName, signal, amplitude, N });
    res.send(generateSignalHTML(signalName, signal, amplitude, 0, N, 0, 0, 0));
});

// Обработка GET-запроса для полигармонического сигнала
app.get('/polyharmonic', (req, res) => {
    const { amplitude1 = 5, frequency1 = 2, amplitude2 = 5, frequency2 = 3, amplitude3 = 5, frequency3 = 5 } = req.query;
    const N = 1000;

    const signal1 = generateSignal('sine', parseFloat(amplitude1), parseFloat(frequency1), 0, N);
    const signal2 = generateSignal('sine', parseFloat(amplitude2), parseFloat(frequency2), 0, N);
    const signal3 = generateSignal('sine', parseFloat(amplitude3), parseFloat(frequency3), 0, N);

    // Объединяем сигналы
    const combinedSignal = {
        x: signal1.x,
        y: signal1.y.map((value, index) => value + signal2.y[index] + signal3.y[index])
    };

    res.send(generateSignalHTML('Полигармонический', combinedSignal, 0, 0, N));
});

// Обработка GET-запроса для отображения добавленных сигналов
app.get('/signals', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Добавленные сигналы</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-4">
            <h1>Добавленные сигналы</h1>
            <ul class="list-group">
                ${signals.map(signal => `
                <li class="list-group-item"><a href="/signal/${signal.name}">${signal.name}</a></li>
                `).join('')}
            </ul>
        </div>
    </body>
    </html>
  `);
});

// Обработка GET-запроса для отображения одного сигнала
app.get('/signal/:name', (req, res) => {
    const signalName = req.params.name;
    const signal = signals.find(sig => sig.name === signalName);
    if (signal) {
        const { name, signal: signalData, amplitude, frequency, phase, N, Dc } = signal;
        res.send(generateSignalHTML(name, signalData, amplitude, frequency, N, Dc, 0));
    } else {
        res.status(404).send('Сигнал не найден');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
