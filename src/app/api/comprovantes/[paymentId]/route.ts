import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  const session = await auth();
  if (!session?.user.id)
    return new NextResponse("Não autorizado", { status: 401 });
  const { paymentId } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { proof: true },
  });
  if (
    !payment?.proof ||
    (payment.userId !== session.user.id && session.user.role !== "ADMIN")
  )
    return new NextResponse("Não encontrado", { status: 404 });
  const storageDir = path.resolve(
    /*turbopackIgnore: true*/ process.env.PROOF_STORAGE_DIR ?? "./storage/payment-proofs",
  );
  const safeName = path.basename(payment.proof.storageKey);
  try {
    const data = await readFile(path.join(storageDir, safeName));
    return new NextResponse(data, {
      headers: {
        "Content-Type": payment.proof.mimeType,
        "Content-Disposition": `inline; filename="comprovante${path.extname(safeName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Arquivo indisponível", { status: 404 });
  }
}
