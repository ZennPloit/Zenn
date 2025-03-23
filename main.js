const axios = require('axios');
const fs = require('fs');

let running = false;
let speed = 1;
let maxSpeed = 10;
let minSpeed = 1;
let proxies = fs.existsSync('proxy.txt') ? fs.readFileSync('proxy.txt', 'utf-8').split('\n').map(p => p.trim()) : [];
let userAgents = fs.existsSync('ua.txt') ? fs.readFileSync('ua.txt', 'utf-8').split('\n').map(ua => ua.trim()) : [];
let messages = fs.existsSync('pesan.txt') ? fs.readFileSync('pesan.txt', 'utf-8').split('\n').map(m => m.trim()) : [];

const referers = [
    "https://www.google.com/",
    "https://www.facebook.com/",
    "https://twitter.com/",
    "https://www.bing.com/"
];

function getRandomHeaders() {
    return {
        "User-Agent": userAgents.length > 0 ? userAgents[Math.floor(Math.random() * userAgents.length)] : "Mozilla/5.0",
        "Referer": referers[Math.floor(Math.random() * referers.length)]
    };
}

function adjustSpeed(success) {
    if (success) {
        speed = Math.min(speed + 1, maxSpeed);
    } else {
        speed = Math.max(speed - 1, minSpeed);
    }
    console.log(`⚡ Kecepatan diperbarui: ${speed}`);
}

function sendRequest(url, message) {
    let headers = getRandomHeaders();
    let proxy = proxies.length > 0 ? proxies[Math.floor(Math.random() * proxies.length)] : null;

    let axiosConfig = {
        method: 'POST',
        url: url,
        headers: headers,
        timeout: 5000,
        proxy: proxy ? {
            host: proxy.split(':')[0],
            port: proxy.split(':')[1]
        } : false,
        data: `message=${encodeURIComponent(message)}`
    };

    axios(axiosConfig)
        .then(response => {
            console.log(`✅ POST -> ${url} | Status: ${response.status} | Pesan: ${message}`);
            adjustSpeed(true);
        })
        .catch(error => {
            console.error('❌ Request Error:', error.message);
            adjustSpeed(false);
        });
}

function startRequests(url) {
    running = true;
    console.log("🚀 Memulai pengiriman request...");

    let index = 0;

    function loopRequests() {
        if (!running || index >= messages.length) {
            stopRequests();
            return;
        }

        sendRequest(url, messages[index]);
        index++;

        setTimeout(loopRequests, 2000 / speed);
    }

    loopRequests();
}

function stopRequests() {
    running = false;
    console.log("🛑 Pengiriman request dihentikan.");
}

const targetURL = 'http://127.0.0.1:8888';

startRequests(targetURL);
