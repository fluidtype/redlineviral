/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },

  // IMPORTANT:
  // Do not inline server secrets into client bundle.
  // Public vars must be prefixed with NEXT_PUBLIC_.
  // Next will replace process.env.NEXT_PUBLIC_* automatically at build time.
};

export default nextConfig;
