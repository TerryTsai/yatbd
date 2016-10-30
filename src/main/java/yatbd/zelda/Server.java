package yatbd.zelda;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import yatbd.zelda.player.Event;
import yatbd.zelda.player.Player;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

final class Server extends TextWebSocketHandler {

    private final ScheduledExecutorService executor;
    private final Set<WebSocketSession> sessions;

    private final World world;

    public Server(long worldNS) {

        this.executor = Executors.newSingleThreadScheduledExecutor();
        this.sessions = new HashSet<>();
        this.world = new World(sessions);

        executor.scheduleAtFixedRate(world, 0, worldNS, TimeUnit.NANOSECONDS);

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        sessions.add(session);

        Player player = world.create(session.getId());

        session.sendMessage(new TextMessage(player.toString()));

        System.out.println("CONNECTED " + session.getId());

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        // Network compensated event time.
        long eventTime = System.nanoTime() - 100000000L;

        Player player = world.retrieve(session.getId());

        if (player != null) {
            String[] data = message.getPayload().split(",");
            player.addEvent(new Event(eventTime, data[1]));
        }

        System.out.println("MESSAGE " + message.toString());

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        sessions.remove(session);

        world.remove(session.getId());

        System.out.println("DISCONNECTED " + session.getId());

    }

}
