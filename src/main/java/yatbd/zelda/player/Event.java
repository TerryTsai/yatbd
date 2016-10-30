package yatbd.zelda.player;

public class Event {

    final long timestamp;
    final Action action;

    public Event(long timestamp, String action) {
        this.timestamp = timestamp;
        this.action = Action.lookup(action);
    }

}
