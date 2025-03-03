import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './services/notification.services';
import { RetrieveNotificationsDto } from './dtos/retrieve-notifications.dto';
import { RetrieveNotificationsResponseDto } from './dtos/retrieve-notifications-response.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('retrieve-notifications')
  @ApiResponse({ status: 200, type: RetrieveNotificationsResponseDto })
  async retrieveNotifications(
    @Body() retrieveNotificationsDto: RetrieveNotificationsDto,
  ): Promise<RetrieveNotificationsResponseDto> {
    return this.notificationService.getRecipients(retrieveNotificationsDto);
  }
}
