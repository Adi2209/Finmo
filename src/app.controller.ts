import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

/**
 * Controller for handling root endpoint.
 */
@Controller()
@ApiTags('Hello World')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint for retrieving a greeting message (Hello World).
   * @returns Hello World.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
