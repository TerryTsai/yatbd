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

final class ZeldaWS extends TextWebSocketHandler {

    private final Map<WebSocketSession, Player> sessions = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    public ZeldaWS(int broadcastPeriodInMilliseconds) {

        // Broadcast state at regular interval
        executor.scheduleAtFixedRate(() -> {

            broadcastGameState();

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

        System.out.println("MESSAGE " + message.toString());

        String[] data = message.getPayload().split(",");

        switch (data[0]) {
            case "s":
                Player player = sessions.get(session);
                player.update(data);
                broadcastGameState();
                break;

            case "c":
                broadcast(data[1]);
                break;

            default:
                System.out.println("UNKNOWN COMMAND");
        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        Player player = sessions.get(session);

        sessions.remove(session);

        System.out.println("DISCONNECTED " + player.toString());

    }

    private void broadcastGameState() {
      // CSV Format
      StringBuilder state = new StringBuilder();
      for (Player player : sessions.values())
          state.append(player.toString()).append("\n");

      broadcast(state.toString());
    }

    private void broadcast(String message) {

        TextMessage textMessage = new TextMessage(message);

        for (WebSocketSession session : sessions.keySet()) {
            try {
                session.sendMessage(textMessage);
            } catch (IOException e) {
                System.out.println("FAILED BROADCAST TO " + session.toString());
            }
        }

    }

}
