/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["127.0.0.1", "localhost", "www.executivesdiary.com","executivebiographybackend-production.up.railway.app"], 
  },
};
export default nextConfig;