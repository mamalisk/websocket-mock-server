import * as express from 'express';
import ConfigurationService, { IExecution } from '../configuration';

export default class RoutingService {
  private router: express.Router;
  constructor(private readonly configurationService : ConfigurationService) {
    this.router = express.Router();
    this.init();
  }

  public get routes() {
    return this.router;
  }

  private init() {
    /* GET home page. */
    this.router.get('/', (req, res, next) => {
      res.render('index', { title: 'Orion Mock WebSocket server' });
    });

    this.router.post('/config', (req, res, next) => {
      try {
        this.configurationService.createExecution(req.body as IExecution);
        res.json({
          created: true
        });
      } catch (error) {
        res.statusCode = 500;
        res.json({
          error,
        });
      }
    });


    this.router.get('/config/:id', (req, res, next) => {
        res.json(this.configurationService.getExecution(req.params.id) || {});
    });
  }

}
