export const clientOrderTemplate = (orderDetails) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); padding: 20px;">
      <h2 style="color: #28a745; border-bottom: 1px solid #ddd; padding-bottom: 10px;">✅ Order Confirmation</h2>

      <p style="font-size: 16px;">Dear <strong>${orderDetails.clientName}</strong>,</p>
      <p style="font-size: 16px;">
        Thank you for choosing <strong>Eagle's Trans Company</strong>. We’re pleased to inform you that your order has been successfully created. Below are the details:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tbody>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1; width: 40%;">Order ID</th>
            <td style="padding: 8px;">${orderDetails.orderId}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Pickup Location</th>
            <td style="padding: 8px;">${orderDetails.pickupLocation}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1;">Destination</th>
            <td style="padding: 8px;">${orderDetails.destination}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Price</th>
            <td style="padding: 8px;">${orderDetails.price} FCFA</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1;">Telephone</th>
            <td style="padding: 8px;">${orderDetails.tel}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Date</th>
            <td style="padding: 8px;">${orderDetails.date}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1;">Time</th>
            <td style="padding: 8px;">${orderDetails.time}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Vehicle Mark</th>
            <td style="padding: 8px;">${orderDetails.vehicleMark}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 30px; font-size: 15px;">
        If you have any questions, feel free to contact us at 
        <a href="mailto:support@eaglestrans.com" style="color: #007BFF;">support@eaglestrans.com</a>.
      </p>

      <p style="margin-top: 20px;">Best regards,<br><strong style="color: #28a745;">Eagle's Trans Company</strong></p>
    </div>
  </div>
`;
