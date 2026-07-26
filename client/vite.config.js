import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const siteUrlPlugin = (siteUrl) => {
  const formattedUrl = (siteUrl || 'https://tax-review-ai.vercel.app').replace(/\/$/, '');
  return {
    name: 'site-url-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      ['sitemap.xml', 'robots.txt', 'index.html'].forEach((file) => {
        const filePath = path.join(distDir, file);
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          if (content.includes('__VITE_SITE_URL__')) {
            content = content.replace(/__VITE_SITE_URL__/g, formattedUrl);
            fs.writeFileSync(filePath, content, 'utf-8');
          }
        }
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/sitemap.xml' || req.url === '/robots.txt') {
          const filePath = path.join(__dirname, 'public', req.url);
          if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            content = content.replace(/__VITE_SITE_URL__/g, formattedUrl);
            res.setHeader('Content-Type', req.url.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8');
            return res.end(content);
          }
        }
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://tax-review-ai.vercel.app';

  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
          }
        }
      }
    }
  };
});
