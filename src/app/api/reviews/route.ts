import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, comment, rating = 5, product } = await request.json();

    // Validate required fields
    if (!name || !comment) {
      return NextResponse.json(
        { success: false, message: "Name and comment are required" },
        { status: 400 }
      );
    }

    // Ensure rating is between 1 and 5
    const normalizedRating = Math.min(Math.max(rating, 1), 5);

    // Create new review
    const review = await Review.create({
      name,
      comment,
      rating: normalizedRating,
      product,
      verifiedPurchase: false, // Initially not verified
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      data: {
        id: review._id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        product: review.product,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit review",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(10); // Get the 10 most recent reviews

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}
