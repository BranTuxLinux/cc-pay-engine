import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CCPay Engine API')
    .setDescription(
      'API para gestionar recargas de wallets de criptomonedas (USDC y COPW). ' +
      'Permite convertir monedas fiat (USD, CHF, COP) a criptomonedas y calcular costos de transacción.'
    )
    .setVersion('1.0.0')
    .addTag('recharges', 'Operaciones de recargas de wallets')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
