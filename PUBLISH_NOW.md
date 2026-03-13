# Publish Now — OAB Simulados

## Situação
Pode publicar agora como MVP, mesmo antes de configurar o Mercado Pago.

## Comportamento sem Mercado Pago
Se `MERCADOPAGO_ACCESS_TOKEN` não estiver configurado:
- o checkout entra em modo mock
- o projeto continua navegável
- o fluxo pode ser demonstrado
- o pagamento real não será validado ainda

## Passos para publicar agora
1. subir no Vercel
2. definir ao menos `PUBLIC_APP_URL`
3. publicar build atual
4. testar navegação completa

## Depois
Configurar `MERCADOPAGO_ACCESS_TOKEN` e validar checkout real.
