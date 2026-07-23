/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['file-type', 'officeparser'],
  },
};

module.exports = nextConfig; 