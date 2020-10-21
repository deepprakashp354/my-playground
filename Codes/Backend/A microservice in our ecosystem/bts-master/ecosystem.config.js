module.exports = {
  apps : [{
    name: 'BTS',
    script: 'dist/index.js',
    instances: 4,
      exec_mode : "cluster",
    out_file: "/home/ubuntu/logs/db-handler.log",
    error_file: "/home/ubuntu/logs/db-handler.log",
    env: {
      NODE_ENV: 'development',
      APP_CONFIG : './common/development.json'
    },
    env_production: {
      NODE_ENV: 'production',
      APP_CONFIG : './common/production.json'
    },
    env_demo: {
      NODE_ENV: 'demo',
      APP_CONFIG : './common/demo.json'
    }
  }]
};