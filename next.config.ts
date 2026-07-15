import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/*": ["./storage/payment-proofs/**/*"],
  },
};

export default nextConfig;
