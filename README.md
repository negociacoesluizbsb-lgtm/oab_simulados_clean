# OAB Simulados Clean

Projeto MVP da plataforma OAB Simulados.

## Escopo atual
- home pública
- login básico
- 2 questões grátis no total
- simulado com 1 questão de amostra
- área premium para assinantes
- checkout com Mercado Pago

## Estado atual
Frontend ajustado para launch MVP.
Projeto pronto para etapa de deploy e validação do checkout real.

## Variáveis de ambiente no Vercel
- `MERCADOPAGO_ACCESS_TOKEN`
- `PUBLIC_APP_URL`

## Desenvolvimento
```bash
npm install
npm run check
npm run build
npm run dev
```

## Deploy
- conectar repositório ao Vercel
- configurar variáveis de ambiente
- publicar build atual
- validar fluxo completo online

## Arquivos operacionais
- `VERCEL_PUBLISH_CHECKLIST.md`
- `PREMIUM_HARDENING_PLAN.md`
- `DEPLOY_READY.md`
- `docs/AUDIT_SUMMARY.md`
- `docs/FRONT_LAUNCH_REVIEW.md`

## Leitura final
Como MVP, está pronto para publicação.
O endurecimento do premium pode vir na próxima etapa, depois da validação do checkout real.
