package yatbd.zelda;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableWebSocket
public class ServerConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

        long worldNS = TimeUnit.MILLISECONDS.toNanos(100);

        registry.addHandler(new Server(worldNS), "/zelda");

    }
}
