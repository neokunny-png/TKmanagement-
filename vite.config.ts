import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function emailNotificationPlugin() {
  return {
    name: 'email-notification-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/send-email', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              console.log('\n==================================================');
              console.log('[TK MANAGEMENT EMAIL NOTIFICATION]');
              console.log('TO: taz0206@naver.com');
              console.log('SUBJECT:', data.subject);
              console.log('ID:', data.inquiryId);
              console.log('==================================================\n');

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Notification successfully processed for taz0206@naver.com',
                recipient: 'taz0206@naver.com'
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emailNotificationPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
