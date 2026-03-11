import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const appUrl = process.env.PUBLIC_APP_URL || `https://${req.headers.host}`;
  const { email } = req.body || {};
  if (!token) return res.status(200).json({ mock: true, message: 'Mercado Pago não configurado localmente.' });
  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [{ id: 'premium-3990', title: 'OAB Simulados Premium', quantity: 1, unit_price: 39.9, currency_id: 'BRL' }],
        payer: email ? { email } : undefined,
        back_urls: {
          success: `${appUrl}/app?payment=success`,
          failure: `${appUrl}/checkout?payment=failure`,
          pending: `${appUrl}/checkout?payment=pending`
        },
        auto_return: 'approved',
      }
    });
    return res.status(200).json({ checkoutUrl: response.init_point, sandboxUrl: response.sandbox_init_point, id: response.id });
  } catch (error: any) {
    return res.status(500).json({ error: 'checkout_error', detail: String(error?.message || error) });
  }
}
