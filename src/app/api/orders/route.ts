import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { customerInfo, items, totalAmount } = body;

    // Validate required fields
    if (!customerInfo || !items || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await Order.create({
      user: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
      },
      shippingAddress: {
        street: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
      },
      items: items.map((item: any) => ({
        productId: item._id,
        productName: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items: items.map((item: any) => ({
          productName: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount,
        shippingAddress: {
          street: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
        },
      });
    } catch (emailError) {
      console.error("Failed to send email, but order was created:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderNumber: order.orderNumber,
        orderId: order._id,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get all orders (for admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query = {};
    if (email) {
      query = { "user.email": email };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
