package yatbd.zelda;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import yatbd.zelda.player.Player;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class World implements Runnable {

    private final Set<WebSocketSession> sessions;
    private final Map<String, Player> players;
    private long prevTime;

    public World(Set<WebSocketSession> sessions) {
        this.sessions = sessions;
        this.players = new ConcurrentHashMap<>();
        this.prevTime = System.nanoTime();
    }

    public Player create(String id) {
        Player Player = new Player(id);
        players.put(id, Player);
        return Player;
    }

    public Player retrieve(String id) {
        return players.get(id);
    }

    public Player remove(String id) {
        Player Player = players.get(id);
        players.remove(id);
        return Player;
    }

    @Override
    public void run() {

        long nextTime = System.nanoTime();

        // Update All Players
        long delta = nextTime - prevTime;
        for (Player player : players.values())
            player.update(prevTime, nextTime, delta);

        // Serialize World State
        StringBuilder state = new StringBuilder();
        state.append(nextTime).append('\n');
        for (Player player : players.values())
            state.append(player.toString()).append('\n');

        // Broadcast To Sessions
        TextMessage textMessage = new TextMessage(state.toString());
        for (WebSocketSession session : sessions) {
            try {
                session.sendMessage(textMessage);
            } catch (IOException e) {
                System.out.println("FAILED BROADCAST TO " + session.getId() + " - " + e.getMessage());
            }
        }

        prevTime = nextTime;
    }

}
