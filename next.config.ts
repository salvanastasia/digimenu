import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // allow only local development on the given IP address
  allowedDevOrigins: ["192.168.1.55"],
};

export default nextConfig;
