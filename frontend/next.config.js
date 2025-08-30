/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...configurações atuais  
  //  Ignora arquivos de teste durante o build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Ignora arquivos de teste
    config.module.rules.push({
      test: /\.test\.(ts|tsx)$/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
}

module.exports = nextConfig