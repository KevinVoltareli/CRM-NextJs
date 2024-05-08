const webpack = require('webpack');


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // ... other configurations
  plugins: [require("daisyui")],

  webpack: (config, { isServer }) => {
    // Verifica se estamos no ambiente de desenvolvimento local (local development).
    if (!isServer) {
      // Define a variável global `isLocalDevelopment` para true.
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.isLocalDevelopment": true,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
