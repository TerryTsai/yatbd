var renderer = PIXI.autoDetectRenderer(720, 720);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var socket = new WebSocket('ws://' + window.location.host + '/zelda');

window.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
        case 37: socket.send('L,s'); break;
        case 38: socket.send('U,s'); break;
        case 39: socket.send('R,s'); break;
        case 40: socket.send('D,s'); break;
    }
});

window.addEventListener('keyup', function(e) {
    switch(e.keyCode) {
        case 37: socket.send('L,e'); break;
        case 38: socket.send('U,e'); break;
        case 39: socket.send('R,e'); break;
        case 40: socket.send('D,e'); break;
    }
});

var players = {};

socket.onmessage = function (e) {
    var rows = e.data.split('\n');
    rows.forEach(row => {
        var data = row.split(',');
        var player = players[data[0]];

        // Remove Player
        if (row.endsWith('-')) {
            stage.removeChild(player.sprite);
            delete players[data[0]];
            return;
        }

        // Create Player
        if (!player) {
            player = new Player();
            players[data[0]] = player;
            stage.addChild(player.sprite);
        }

        // Update Player
        player.update(data);
    });
};

var prevTime = window.performance.now();
function animate() {
    requestAnimationFrame(animate);
    var nextTime = window.performance.now();
    var delta = nextTime - prevTime;

    for (var player in players) {
        if (players.hasOwnProperty(player)) {
            players[player].smooth(delta);
        }
    }

    renderer.render(stage);
    prevTime = nextTime;
}
animate();
