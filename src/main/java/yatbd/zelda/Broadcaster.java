package yatbd.zelda;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class Broadcaster {

    private final ExecutorService executor;
    private final Set<WebSocketSession> sessions;

    Broadcaster(Set<WebSocketSession> sessions) {
        this.executor = Executors.newFixedThreadPool(10);
        this.sessions = sessions;
    }

    void broadcast(String message) {
        TextMessage textMessage = new TextMessage(message);

        for (WebSocketSession session : sessions) {

            executor.submit(() -> {
                try {
                    session.sendMessage(textMessage);
                } catch (IOException e) {
                    System.out.println("FAILED BROADCAST TO " + session.getId() + " - " + e.getMessage());
                }
            });

        }
    }

}
