import {createServer, Server as HttpServer} from 'http';
import {Server as WebSocketServer} from 'ws';
import {parse as urlParse} from 'url';
import { of, from, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import ConfigurationService, { Behavior, IExecution } from '../configuration';

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

    private getObservableFrom(execution : IExecution) : Observable<any> {
        const { responseBody } = execution;
        const source$ = Array.isArray(responseBody) ? from(responseBody) : of(responseBody);
        return source$;
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
                        case Behavior.DELAY_INITIAL_RESPONSE: {
                            this.getObservableFrom(execution).pipe(
                                delay(5000)
                            ).subscribe(
                                (_) => webSocket.send(JSON.stringify(_)),
                                (error) => webSocket.send(JSON.stringify({ error }))
                            )
                            break;
                        }
                        case Behavior.SUCCESSFUL_RESPONSE:
                        default: {
                            this.getObservableFrom(execution).subscribe(
                                (_) => webSocket.send(JSON.stringify(_)),
                                (error) => webSocket.send(JSON.stringify({ error })),
                            );
                        }
                    }
                } catch (error) {
                    webSocket.send(`Your message is not JSON. ${data}`);
                    return;
                }

            } );
        });
    }
}