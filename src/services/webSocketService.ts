import {createServer, Server as HttpServer} from 'http';
import {Server as WebSocketServer} from 'ws';
import {parse as urlParse} from 'url';
import { of } from 'rxjs';

import ConfigurationService, { Behavior } from '../configuration';

export class WebSocketService {
    public static create(server: HttpServer, configuration: ConfigurationService): WebSocketService {
        return new WebSocketService(server, configuration);
    }

    private wss: WebSocketServer;

    private constructor(private readonly server: HttpServer,
        private readonly configuration: ConfigurationService) {
        this.wss = new WebSocketServer({
            noServer: true,
        });
        this.init();
        server.on('upgrade', (request, socket, head) => {
            const pathname = urlParse(request.url).pathname;

            if(pathname === '/ws') {
              this.wss.handleUpgrade(request, socket, head, (ws) => {
                this.wss.emit('connection', ws, request);
              });
            }
         });
    }

    private init(): void {
        this.wss.on('connection', (webSocket) => {
            webSocket.on('message', (data) => {
                try {
                    const body = JSON.parse(data as string);
                    const execution = this.configuration.getExecution(body.id);
                    if(!execution) {
                        webSocket.send(data);
                        return;
                    }
                    switch(execution!.behavior) {
                        case Behavior.SUCCESSFUL_RESPONSE:
                        default: webSocket.send(JSON.stringify(execution.responseBody));
                    }
                } catch (error) {
                    webSocket.send(`Your message is not JSON. ${data}`);
                    return;
                }

            } );
        });
    }
}