module.exports = {
  apps: [
    {
      name: 'briefly-app',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: ['start', '-p', process.env.PORT || '1200'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

