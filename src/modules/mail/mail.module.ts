import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailService } from './mail.service'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('smtp_host'),
          secure: true,
          tls: {
            servername: config.get('smtp_domain'),
          },
          auth: {
            user: config.get('smtp_user'),
            pass: config.get('smtp_password'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('smtp_user')}>`,
        },
        template: {
          dir: `${__dirname.split('dist')[0]}/src/modules/mail/templates`,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
