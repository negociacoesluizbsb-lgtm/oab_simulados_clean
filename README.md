# oab_simulados_clean

Projeto limpo da plataforma OAB Simulados.

## Escopo atual
- home pública
- login obrigatório
- 2 questões grátis no total
- simulado com 1 questão de amostra
- área premium para assinantes
- checkout preparado com Mercado Pago

## Ambiente
Crie as variáveis no Vercel:
- `MERCADOPAGO_ACCESS_TOKEN`
- `PUBLIC_APP_URL`

## Desenvolvimento
```bash
npm install
npm run dev
npm run build
```

## Publicação
- GitHub conectado ao Vercel
- rota serverless em `api/create-checkout.ts`
