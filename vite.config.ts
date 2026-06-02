import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function injectCriticalPreload(): Plugin {
  return {
    name: "inject-critical-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;

        const tags: string[] = [];

        for (const [fileName, item] of Object.entries(bundle)) {
          if (item.type === "chunk") {
            const href = `/${fileName.replace(/\\/g, "/")}`;
            if (fileName.includes("vendor-react")) {
              tags.push(
                `<link rel="modulepreload" crossorigin href="${href}">`,
              );
            }
            if (/assets\/index-[^/]+\.js$/.test(fileName.replace(/\\/g, "/"))) {
              tags.push(
                `<link rel="modulepreload" crossorigin href="${href}">`,
              );
            }
          }
          if (
            fileName.includes("DSC07140") &&
            fileName.includes("768w") &&
            fileName.endsWith(".webp")
          ) {
            const href = `/${fileName.replace(/\\/g, "/")}`;
            tags.push(
              `<link rel="preload" href="${href}" as="image" type="image/webp">`,
            );
          }
        }

        if (tags.length === 0) return html;
        return html.replace(
          "<!--ssr-helmet-link-->",
          `${tags.join("\n    ")}\n    <!--ssr-helmet-link-->`,
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), injectCriticalPreload()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || /\/react\//.test(id)) return "vendor-react";
          if (id.includes("@tanstack/react-query")) return "vendor-query";
          if (
            id.includes("recharts") ||
            id.includes("framer-motion") ||
            id.includes("@radix-ui")
          ) {
            return "vendor-ui";
          }
          return "vendor-misc";
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
