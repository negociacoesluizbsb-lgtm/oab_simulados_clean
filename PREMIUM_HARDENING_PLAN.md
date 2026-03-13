# Premium Hardening Plan — OAB Simulados

## Problema atual
O acesso premium ainda depende de estado local no navegador (`localStorage`) e pode ser ativado sem validação robusta.

## Objetivo
Transformar o premium em acesso real, controlado no servidor.

## Etapas
### 1. Autenticação real
- criar login real
- persistir usuário no backend
- vincular assinatura ao usuário

### 2. Fonte de verdade do premium
- remover dependência de `subscribed` apenas no front
- validar assinatura via backend
- responder status premium por API

### 3. Controle de conteúdo
- proteger premium no servidor
- limitar questões grátis e simulado demo por regra backend
- impedir desbloqueio só por manipulação de navegador

### 4. Checkout real
- manter Mercado Pago
- registrar pagamento aprovado
- marcar usuário como premium após confirmação
- tratar `success`, `failure`, `pending`

### 5. Estrutura mínima sugerida
- `users`
- `subscriptions`
- `payments`
- `access_logs` (opcional)

## Prioridade prática
1. publicar MVP
2. validar checkout real
3. só então endurecer premium

## Regra
Não complicar antes de colocar no ar.
