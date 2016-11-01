package yatbd.zelda;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

final class Server extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions;
    private final Broadcaster broadcaster;
    private final World world;

    private final ScheduledExecutorService executor;

    Server(long worldNS) {
        this.sessions = new HashSet<>();
        this.broadcaster = new Broadcaster(sessions);
        this.world = new World(broadcaster);

        this.executor = Executors.newSingleThreadScheduledExecutor();
        executor.scheduleAtFixedRate(world, 0, worldNS, TimeUnit.NANOSECONDS);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        world.create(session.getId());
        System.out.println("CONNECTED " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        world.event(session.getId(), message.getPayload());
        System.out.println("MESSAGE " + message.toString());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        world.remove(session.getId());
        System.out.println("DISCONNECTED " + session.getId());
    }

}
