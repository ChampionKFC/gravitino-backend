import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOrderCloseMessage(dtoEmail) {
    console.log(dtoEmail)

    const res = await this.mailerService.sendMail({
      to: dtoEmail.guest_email,
      subject: AppStrings.MAIL_ORDER_CLOSE_SUBJECT,
      template: './order_close',
      context: {
        guest_name: dtoEmail.guest_name,
        order_name: dtoEmail.order_name,
        facility_name: dtoEmail.facility_name,
      },
    })

    console.log(res)
  }
}
