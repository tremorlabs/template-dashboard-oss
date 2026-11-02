/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    // Ignora los errores de ESLint durante el proceso de compilación de producción
    ignoreDuringBuilds: true,
  },
  // Expone la clave al navegador
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/overview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
