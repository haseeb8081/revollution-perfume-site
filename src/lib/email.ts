import nodemailer from "nodemailer";

interface OrderItem {
  productName: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Email template
function generateOrderEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e0e7ef;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${item.image}" alt="${item.productName}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" />
          <div>
            <div style="font-weight: 600; color: #0b1f3b; margin-bottom: 4px;">${item.productName}</div>
            <div style="font-size: 0.85rem; color: #5f6b85; text-transform: uppercase;">${item.category}</div>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e7ef; text-align: center;">${item.quantity}</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e7ef; text-align: right; font-weight: 600; color: #0b1f3b;">$${item.price.toFixed(2)}</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e7ef; text-align: right; font-weight: 700; color: #00c896;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Revollution</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f9ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f9ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(11, 31, 59, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00c896 0%, #00a0ff 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 50px; height: 50px; background: #ffffff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <span style="font-size: 1.8rem; font-weight: 700; color: #00c896;">R</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 1.8rem; font-weight: 700;">Revollution</h1>
              <p style="margin: 5px 0 0; color: rgba(255,255,255,0.9); font-size: 0.9rem;">Signature Perfume House</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, rgba(0, 200, 150, 0.15) 0%, rgba(0, 160, 255, 0.15) 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="font-size: 2.5rem; color: #00c896;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px; color: #0b1f3b; font-size: 1.8rem; font-weight: 800;">Order Confirmed!</h2>
              <p style="margin: 0; color: #5f6b85; font-size: 1rem;">Thank you for your order, ${data.customerName}</p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: linear-gradient(135deg, rgba(0, 200, 150, 0.1) 0%, rgba(0, 160, 255, 0.1) 100%); border-radius: 12px; padding: 20px; text-align: center; border: 2px solid rgba(0, 200, 150, 0.2);">
                <div style="font-size: 0.85rem; color: #5f6b85; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.05em;">Order Number</div>
                <div style="font-size: 1.3rem; font-weight: 700; color: #0b1f3b;">${data.orderNumber}</div>
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="margin: 0 0 20px; color: #0b1f3b; font-size: 1.2rem; font-weight: 700;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e7ef; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background: #f5f9ff;">
                    <th style="padding: 12px 15px; text-align: left; font-size: 0.85rem; color: #5f6b85; font-weight: 600; text-transform: uppercase;">Product</th>
                    <th style="padding: 12px 15px; text-align: center; font-size: 0.85rem; color: #5f6b85; font-weight: 600; text-transform: uppercase;">Qty</th>
                    <th style="padding: 12px 15px; text-align: right; font-size: 0.85rem; color: #5f6b85; font-weight: 600; text-transform: uppercase;">Price</th>
                    <th style="padding: 12px 15px; text-align: right; font-size: 0.85rem; color: #5f6b85; font-weight: 600; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #f5f9ff; border-radius: 12px; padding: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #5f6b85;">Subtotal:</span>
                  <span style="color: #0b1f3b; font-weight: 600;">$${data.totalAmount.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e7ef;">
                  <span style="color: #5f6b85;">Shipping:</span>
                  <span style="color: #00c896; font-weight: 600;">Free</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-size: 1.2rem; font-weight: 700; color: #0b1f3b;">Total:</span>
                  <span style="font-size: 1.3rem; font-weight: 700; color: #00c896;">$${data.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 30px 40px;">
              <h3 style="margin: 0 0 15px; color: #0b1f3b; font-size: 1.2rem; font-weight: 700;">Shipping Address</h3>
              <div style="background: #f5f9ff; border-radius: 12px; padding: 20px; color: #5f6b85; line-height: 1.6;">
                <div style="font-weight: 600; color: #0b1f3b; margin-bottom: 5px;">${data.customerName}</div>
                <div>${data.shippingAddress.street}</div>
                <div>${data.shippingAddress.city}, ${data.shippingAddress.postalCode}</div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f5f9ff; padding: 30px; text-align: center; border-top: 1px solid #e0e7ef;">
              <p style="margin: 0 0 15px; color: #5f6b85; font-size: 0.9rem;">
                We'll send you a shipping confirmation email as soon as your order ships.
              </p>
              <p style="margin: 0 0 20px; color: #5f6b85; font-size: 0.9rem;">
                Questions? Contact us at <a href="mailto:support@revollution.com" style="color: #00c896; text-decoration: none; font-weight: 600;">support@revollution.com</a>
              </p>
              <div style="padding-top: 20px; border-top: 1px solid #e0e7ef;">
                <p style="margin: 0; color: #a0acc2; font-size: 0.8rem;">
                  © ${new Date().getFullYear()} Revollution. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  orderData: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "Revollution <noreply@revollution.com>",
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber} | Revollution`,
      html: generateOrderEmailHTML(orderData),
    };

    await transporter.sendMail(mailOptions);

    console.log(`Order confirmation email sent to ${orderData.customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("Email server verification failed:", error);
    return false;
  }
}
