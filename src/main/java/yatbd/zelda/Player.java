package yatbd.zelda;

import java.util.Collection;
import java.util.EnumMap;

class Player {

    private final String id;
    private final EnumMap<Action, Long> actions;

    private float x, y;
    private float hw, hh;
    private float speed;

    Player(String id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.hw = 15;
        this.hh = 20;
        this.speed = 0.0000002f;

        this.actions = new EnumMap<>(Action.class);
        for (Action action : Action.values())
            this.actions.put(action, 0L);
    }

    void addEvent(Event event) {
        actions.put(event.action, event.start ? event.timestamp : 0);
    }

    void update(long delta, Collection<Player> players) {

        float nextY = y;
        long ud = actions.get(Action.MOVE_U) - actions.get(Action.MOVE_D);
        if (ud > 0) {
            nextY = y - (speed * delta);
        } else if (ud < 0) {
            nextY = y + (speed * delta);
        }

        float nextX = x;
        long lr = actions.get(Action.MOVE_L) - actions.get(Action.MOVE_R);
        if (lr > 0) {
            nextX = x - (speed * delta);
        } else if (lr < 0) {
            nextX = x + (speed * delta);
        }

        for (Player that : players) {
            if (this != that && Math.collides(nextX, nextY, this.hw, this.hh, that.x, that.y, that.hw, that.hh)) {
                return;
            }
        }

        this.x = nextX;
        this.y = nextY;
    }

    @Override
    public String toString() {
        long ud = actions.get(Action.MOVE_U) - actions.get(Action.MOVE_D);
        long lr = actions.get(Action.MOVE_R) - actions.get(Action.MOVE_L);
        return String.format("%s,%f,%f,%d,%d", id, x, y, ud, lr);
    }

}

