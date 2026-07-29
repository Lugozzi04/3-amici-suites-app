/** @type {import('next').NextConfig} */
const basePath = "/3-amici-suites";

const nextConfig = {
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
