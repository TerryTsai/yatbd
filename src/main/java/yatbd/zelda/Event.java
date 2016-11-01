package yatbd.zelda;

public class Event {

    final long timestamp;
    final boolean start;
    final Action action;
    private final Player player;

    Event(long timestamp, boolean start, Player player, Action action) {
        this.timestamp = timestamp;
        this.start = start;
        this.action = action;
        this.player = player;
    }

    void apply() {
        player.addEvent(this);
    }

}
