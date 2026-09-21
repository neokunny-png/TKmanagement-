import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {
  generateStaticPages,
  buildActorHtml,
  buildSectionHtml,
  OFFICIAL_STATIC_ACTORS,
  STATIC_SECTIONS,
} from './scripts/generate-static-pages';

function seoPrerenderPlugin() {
  return {
    name: 'seo-prerender-plugin',
    transformIndexHtml(html: string, ctx: any) {
      const url = ctx?.originalUrl || ctx?.path || '';
      for (const actor of OFFICIAL_STATIC_ACTORS) {
        if (url.includes(`/artists/${actor.slug}`)) {
          return buildActorHtml(html, actor);
        }
      }
      for (const section of STATIC_SECTIONS) {
        if (url === `/${section.path}` || url.startsWith(`/${section.path}/`)) {
          return buildSectionHtml(html, section);
        }
      }
      return html;
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      try {
        generateStaticPages(distDir);
      } catch (err) {
        console.error('[TK SEO] closeBundle static generation note:', err);
      }
    },
  };
}

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
    plugins: [react(), tailwindcss(), emailNotificationPlugin(), seoPrerenderPlugin()],
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
