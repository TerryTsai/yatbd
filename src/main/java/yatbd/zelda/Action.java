package yatbd.zelda;

import java.util.HashMap;
import java.util.Map;

enum Action {

    MOVE_U("U"),
    MOVE_D("D"),
    MOVE_L("L"),
    MOVE_R("R"),
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
