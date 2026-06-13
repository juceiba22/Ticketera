import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

interface EventDetails {
    nombre: string;
    precio: number;
    slug: string;
}

export const requestPreference = async (name: string, email: string, ticketId: string, event: EventDetails) => {

    const preference = new Preference(client);

    try {
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: `TICKET_${event.slug.toUpperCase()}`,
                        title: `Entrada General - ${event.nombre}`,
                        quantity: 1,
                        unit_price: Number(event.precio),
                        currency_id: 'ARS',
                    }
                ],
                payer: {
                    name,
                    email,
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_SITE_URL}/evento/${event.slug}/success`,
                    failure: `${process.env.NEXT_PUBLIC_SITE_URL}/evento/${event.slug}`,
                    pending: `${process.env.NEXT_PUBLIC_SITE_URL}/evento/${event.slug}`,
                },
                auto_return: 'all',
                notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
                external_reference: ticketId // Guardaremos el ID para identificar la transacción en el webhook
            }
        });

        return response.init_point;
    } catch (error) {
        console.error("Error Mercado Pago", error);
        throw new Error('Error creando la preferencia de pago');
    }
};
