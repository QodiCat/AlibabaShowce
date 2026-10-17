import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',fullyParallel:false,
 use:{baseURL:'http://127.0.0.1:3107',headless:true,channel:'msedge',trace:'retain-on-failure'},
 webServer:{command:'node server.mjs',url:'http://127.0.0.1:3107',reuseExistingServer:false,env:{PORT:'3107',DATA_DIR:'.cache/browser-test-data',ADMIN_PASSWORD:'browser-test-only-password'}},
});
