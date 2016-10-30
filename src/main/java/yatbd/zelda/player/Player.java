package yatbd.zelda.player;

import java.util.EnumMap;
import java.util.PriorityQueue;

public class Player {

    private final String id;
    private final EnumMap<Action, Long> absolute;
    private final EnumMap<Action, Boolean> effective;
    private final PriorityQueue<Event> events;

    private float x, y;
    private float speed;

    public Player(String id) {
        this.id = id;
        this.absolute = new EnumMap<>(Action.class);
        this.effective = new EnumMap<>(Action.class);
        this.events = new PriorityQueue<>((o1, o2) -> (int) (o1.timestamp - o2.timestamp));

        this.x = 0;
        this.y = 0;
        this.speed = 1f;
    }

    public void addEvent(Event event) {
        events.add(event);
    }

    public void update(long prevTime, long nextTime, long delta) {

        // Only process up to nextTime
        Event event = events.peek();
        if (event == null || event.timestamp > nextTime)
            return;



    }

    @Override
    public String toString() {
        return String.format("%s,%s,%f,%f,%f", id, x, y, speed);
    }

}

