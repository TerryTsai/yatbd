package yatbd.zelda;

import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;

public class World implements Runnable {

    private final Broadcaster broadcaster;
    private final Queue<Event> events;
    private final Map<String, Player> players;
    private long prevTime;

    World(Broadcaster broadcaster) {
        this.broadcaster = broadcaster;

        this.events = new LinkedList<>();
        this.players = new ConcurrentHashMap<>();
        this.prevTime = System.nanoTime();
    }

    void create(String id) {
        players.put(id, new Player(id));
    }

    void event(String id, String event) {
        Player player = players.get(id);
        if (player != null) {
            String[] data = event.split(",");
            Action action = Action.lookup(data[0]);
            boolean start = data[1].equals("s");
            long timestamp = System.nanoTime();
            events.add(new Event(timestamp, start, player, action));
        }
    }

    void remove(String id) {
        Player player = players.remove(id);
        if (player != null) {
            broadcaster.broadcast(player.toString() + ",-");
        }
    }

    @Override
    public void run() {

        long nextTime = System.nanoTime();

        // Process All Events
        long lastEventTime = prevTime;
        Event event = events.peek();
        while (event != null && event.timestamp < nextTime) {
            event = events.poll();
            if (event.timestamp >= prevTime) {
                long delta = event.timestamp - lastEventTime;
                for (Player p1 : players.values()) {
                    p1.update(delta, players.values());
                }
                event.apply();
                lastEventTime = event.timestamp;
            }
            event = events.peek();
        }

        // Fast Forward To Next Window
        long delta = nextTime - lastEventTime;
        for (Player player : players.values()) {
            player.update(delta, players.values());
        }

        // Serialize World State
        StringBuilder state = new StringBuilder();
        for (Player player : players.values()) {
            state.append(player.toString()).append('\n');
        }

        // Broadcast To Sessions
        broadcaster.broadcast(state.toString());

        prevTime = nextTime;

    }

}
