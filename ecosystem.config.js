module.exports = {
  apps: [
    {
      name: 'surrealdb',
      script: 'surreal',
      args: 'start --user root --pass root rocksdb:./data/surreal.db',
      watch: false,
      restart_delay: 4000,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'backend',
      script: './back/target/release/back',
      cwd: '/back',
      watch: false,
      restart_delay: 4000,
      env: {
        RUST_LOG: 'warn',
        SURREAL_HOST: '127.0.0.1',
        SURREAL_PORT: '8000'
      }
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '/mavrickcc',
      watch: false,
      restart_delay: 4000
    }
  ]
};
