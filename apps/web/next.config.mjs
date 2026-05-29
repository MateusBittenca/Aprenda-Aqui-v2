/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["database"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
