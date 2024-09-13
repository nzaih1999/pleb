/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sessionize.com",
        port: "",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
