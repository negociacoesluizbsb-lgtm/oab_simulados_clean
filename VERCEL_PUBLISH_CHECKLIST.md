# Vercel Publish Checklist — OAB Simulados

## 1. Variáveis de ambiente
- [ ] `MERCADOPAGO_ACCESS_TOKEN`
- [ ] `PUBLIC_APP_URL`

## 2. Build
- [ ] `npm install`
- [ ] `npm run check`
- [ ] `npm run build`

## 3. Deploy
- [ ] conectar repositório ao Vercel
- [ ] confirmar `vercel.json`
- [ ] publicar build atual

## 4. Testes online
- [ ] abrir home
- [ ] testar login
- [ ] testar 2 questões grátis
- [ ] testar simulado com 1 questão de amostra
- [ ] testar `/api/create-checkout`
- [ ] validar retorno `success`
- [ ] validar retorno `failure`
- [ ] validar retorno `pending`

## 5. Go live
- [ ] revisar copy principal
- [ ] revisar botão de assinatura
- [ ] liberar tráfego só após validar checkout real
