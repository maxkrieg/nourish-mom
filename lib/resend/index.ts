import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Nourish Mom <onboarding@resend.dev>'

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: 'Daily',
  THREE_PER_WEEK: '3× per week',
  TWICE_PER_WEEK: 'Twice per week',
  WEEKLY: 'Weekly',
}

type OrderItem = {
  quantity: number
  menuItem: { name: string; price: number }
}

type DeliveryWindow = {
  label: string
}

type Order = {
  id: string
  startDate: Date
  frequency: string
  durationWeeks: number
  specialNotes?: string | null
  items: OrderItem[]
  deliveryWindow: DeliveryWindow
}

export async function sendOrderConfirmation({
  to,
  order,
  customerName,
}: {
  to: string
  order: Order
  customerName?: string | null
}) {
  const greeting = customerName ? `Hi ${customerName}` : `Hi there`
  const subtotal = order.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)

  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E8E6;">${i.menuItem.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E8E6;text-align:center;">×${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E8E6;text-align:right;">$${((i.menuItem.price * i.quantity) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;color:#222222;">
      <div style="background:#4A9B8E;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Nourish Mom</h1>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #E8E8E6;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;">${greeting} — your order is confirmed!</h2>
        <p style="color:#717171;margin:0 0 24px;">Here's a summary of what's coming your way.</p>

        <h3 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#717171;margin:0 0 12px;">Your Meals</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${itemRows}
          <tr>
            <td colspan="2" style="padding-top:12px;font-weight:600;">Total</td>
            <td style="padding-top:12px;font-weight:700;text-align:right;color:#4A9B8E;">$${(subtotal / 100).toFixed(2)}</td>
          </tr>
        </table>

        <div style="margin-top:24px;background:#FAFAF9;border-radius:10px;padding:20px;">
          <h3 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#717171;margin:0 0 12px;">Delivery Schedule</h3>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;color:#717171;width:50%;">Start date</td>
              <td style="padding:4px 0;font-weight:500;">${order.startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#717171;">Delivery window</td>
              <td style="padding:4px 0;font-weight:500;">${order.deliveryWindow.label}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#717171;">Frequency</td>
              <td style="padding:4px 0;font-weight:500;">${FREQUENCY_LABELS[order.frequency] ?? order.frequency}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#717171;">Duration</td>
              <td style="padding:4px 0;font-weight:500;">${order.durationWeeks} ${order.durationWeeks === 1 ? 'week' : 'weeks'}</td>
            </tr>
          </table>
        </div>

        ${
          order.specialNotes
            ? `<div style="margin-top:16px;background:#FAFAF9;border-radius:10px;padding:20px;">
                <h3 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#717171;margin:0 0 8px;">Special Instructions</h3>
                <p style="font-size:14px;color:#717171;margin:0;">${order.specialNotes}</p>
               </div>`
            : ''
        }

        <p style="margin-top:24px;font-size:13px;color:#717171;">
          Questions? Reply to this email or contact us at <a href="mailto:support@nourishmom.com" style="color:#4A9B8E;">support@nourishmom.com</a>.
        </p>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Your order is confirmed — Nourish Mom',
      html,
    })
  } catch (err) {
    console.error('[Resend] Failed to send order confirmation:', err)
  }
}

export async function sendDeliveryReminder({
  to,
  deliveryWindow,
  deliveryAddress,
  customerName,
}: {
  to: string
  deliveryWindow: DeliveryWindow
  deliveryAddress: string
  customerName?: string | null
}) {
  const greeting = customerName ? `Hi ${customerName}` : `Hi there`

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;color:#222222;">
      <div style="background:#4A9B8E;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Nourish Mom</h1>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #E8E8E6;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;">${greeting} — your delivery is tomorrow!</h2>
        <p style="color:#717171;margin:0 0 24px;">Here's a reminder of what to expect.</p>

        <div style="background:#FAFAF9;border-radius:10px;padding:20px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;color:#717171;width:50%;">Delivery window</td>
              <td style="padding:4px 0;font-weight:500;">${deliveryWindow.label}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#717171;">Delivery address</td>
              <td style="padding:4px 0;font-weight:500;">${deliveryAddress || 'On file with your account'}</td>
            </tr>
          </table>
        </div>

        <p style="margin-top:24px;font-size:14px;color:#717171;">
          Need to make changes? Please contact us at least 12 hours before your delivery window at
          <a href="mailto:support@nourishmom.com" style="color:#4A9B8E;">support@nourishmom.com</a>.
        </p>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Your delivery is tomorrow — Nourish Mom',
      html,
    })
  } catch (err) {
    console.error('[Resend] Failed to send delivery reminder:', err)
  }
}
