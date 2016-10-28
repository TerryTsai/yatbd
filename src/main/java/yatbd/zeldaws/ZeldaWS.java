package yatbd.zeldaws;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.function.BinaryOperator;

class ZeldaWS extends TextWebSocketHandler {

    private final Map<WebSocketSession, Player> sessions = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    public ZeldaWS(int broadcastPeriodInMilliseconds) {

        // Broadcast state at regular interval
        executor.scheduleAtFixedRate(() -> {

            // CSV format
            StringBuilder state = new StringBuilder();
            for (Player player : sessions.values()) {
                state.append(player.toString()).append("\n");
            }

            TextMessage message = new TextMessage(state.toString());

            // Send to each player
            for (WebSocketSession session : sessions.keySet()) {
                try {
                    session.sendMessage(message);
                } catch (IOException e) {
                    System.out.println("FAILED BROADCAST TO " + session.toString());
                }
            }

        }, 0, broadcastPeriodInMilliseconds, TimeUnit.MILLISECONDS);

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        Player newPlayer = new Player();

        sessions.put(session, newPlayer);

        session.sendMessage(new TextMessage(newPlayer.toString()));

        System.out.println("CONNECTED " + newPlayer.toString());

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Player player = sessions.get(session);

        player.update(message.getPayload());

        System.out.println("MESSAGE " + message.toString());

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        Player player = sessions.get(session);

        sessions.remove(session);

        System.out.println("DISCONNECTED " + player.toString());

    }

}
