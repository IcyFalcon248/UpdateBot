const mc = require('minecraft-protocol');
const http = require('http');

// Function to generate a random username
function generateRandomName() {
    const adjectives = ["Cool", "Funny", "Brave", "Silly", "Wise"];
    const nouns = ["Panda", "Dragon", "Knight", "Wizard", "Ninja"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
}

const serverIP = 'TheSMPsFel.aternos.me'; // Updated server hostname
const serverPort = 26383; // Updated server port
const username = generateRandomName(); // Generate random name

let client;

function createBot() {
    client = mc.createClient({
        host: serverIP,
        port: serverPort,
        username: username,
        version: '1.21.1', // Use the version you want to connect with
    });

    client.on('login', () => {
        console.log(`${username} has joined the server!`);
        randomMovementAndCombat();
    });

    client.on('error', (err) => {
        console.error('Bot error:', err);
        client.quit();
    });

    client.on('end', () => {
        console.log(`${username} has left the server!`);
        setTimeout(createBot, 60000); // Restart after 60 seconds
    });
}

function randomMovementAndCombat() {
    setInterval(() => {
        // Example of sending a movement packet
        const direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0: // Move forward
                client.write('player_position', { x: client.entity.position.x, y: client.entity.position.y, z: client.entity.position.z + 1, onGround: true });
                break;
            case 1: // Move backward
                client.write('player_position', { x: client.entity.position.x, y: client.entity.position.y, z: client.entity.position.z - 1, onGround: true });
                break;
            case 2: // Move left
                client.write('player_position', { x: client.entity.position.x - 1, y: client.entity.position.y, z: client.entity.position.z, onGround: true });
                break;
            case 3: // Move right
                client.write('player_position', { x: client.entity.position.x + 1, y: client.entity.position.y, z: client.entity.position.z, onGround: true });
                break;
        }

        // You would also need to implement zombie detection and attacking logic here
    }, 300); // Check every 0.3 seconds
}

createBot();

// HTTP Server to respond to pings
http.createServer((req, res) => {
    console.log('Received a ping request'); // Log when a request is received
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
}).listen(process.env.PORT || 3000, () => {
    console.log('HTTP Server running!');
});
