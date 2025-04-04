export const adminOrderTemplate = (orderDetails) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); padding: 20px;">
      <h2 style="color: #007BFF; border-bottom: 1px solid #ddd; padding-bottom: 10px;">🚨 New Order Notification</h2>

      <p style="font-size: 16px;">Dear Admin,</p>
      <p style="font-size: 16px;">A new order has been placed. Please find the details below:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tbody>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1; width: 40%;">Order ID</th>
            <td style="padding: 8px;">${orderDetails.orderId}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Client Name</th>
            <td style="padding: 8px;">${orderDetails.clientName}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1;">Email</th>
            <td style="padding: 8px;">${orderDetails.clientEmail}</td>
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
            <th style="text-align: left; padding: 8px; background: #f1f1f1;">Date</th>
            <td style="padding: 8px;">${orderDetails.date}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Time</th>
            <td style="padding: 8px;">${orderDetails.time}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f1f1f1;">Telephone</th>
            <td style="padding: 8px;">${orderDetails.tel}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; background: #f9f9f9;">Vehicle Mark</th>
            <td style="padding: 8px;">${orderDetails.vehicleMark}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 30px;">Please proceed with processing this order promptly.</p>

      <p style="margin-top: 20px;">Best regards,<br><strong style="color: #007BFF;">Eagle's Trans System</strong></p>
    </div>
  </div>
`;
