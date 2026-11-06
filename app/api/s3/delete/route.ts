// import { S3 } from "@/lib/S3Clinet";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  await requireAdmin();
  try {
    // const decision = await aj.protect(request, {
    //   fingerprint: session?.user.id as string,
    // });

    // if (decision.isDenied()) {
    //   return NextResponse.json(
    //     { error: "Too many requests. Please try again later." },
    //     { status: 429 }
    //   );
    // }

    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 },
      );
    }

    // Delete the file from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
