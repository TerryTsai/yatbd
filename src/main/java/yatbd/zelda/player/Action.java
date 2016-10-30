package yatbd.zelda.player;

import java.util.HashMap;
import java.util.Map;

public enum Action {

    IDLE("IDLE"),
    MOVE_U("MOVE_U"),
    MOVE_D("MOVE_D"),
    MOVE_L("MOVE_L"),
    MOVE_R("MOVE_R"),
    ;

    private final String text;

    Action(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return text;
    }

    // LOOKUP

    public static Action lookup(String text) {
        return lookup.get(text);
    }

    private static final Map<String, Action> lookup = new HashMap<>();

    static {
        for (Action action : Action.values())
            lookup.put(action.text, action);
    }

}
