import type { Plugin } from "vite";
import { version as VITE_VERSION } from "vite";

export function stableHmr(): Plugin {
  return {
    name: "stable-hmr",
    enforce: "post",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (!url.includes("/@vite/client")) {
          return next();
        }

        const origEnd = res.end.bind(res);
        const chunks: Buffer[] = [];

        res.write = function (chunk: any) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          return true;
        } as any;

        res.end = function (chunk?: any) {
          if (chunk) {
            chunks.push(
              Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
            );
          }
          let body = Buffer.concat(chunks).toString("utf-8");

          const patched = body.replace(
            /console\.log\(\s*`\[vite\] server connection lost\. Polling for restart\.\.\.`\s*\);\s*const socket = payload\.data\.webSocket;\s*const url = new URL\(socket\.url\);\s*url\.search = "";\s*await waitForSuccessfulPing\(url\.href\);\s*location\.reload\(\);/g,
            'console.debug("[vite] connection cycled (suppressed reload)");',
          );

          if (patched === body) {
            console.warn(
              `[stable-hmr] HMR patch regex did not match — the Vite client code may have changed. ` +
                `Vite version: ${VITE_VERSION}. Full-page reloads on reconnect will NOT be suppressed.`,
            );
          }

          body = patched;

          const buf = Buffer.from(body, "utf-8");
          res.setHeader("content-length", buf.length);
          return origEnd(buf);
        } as any;

        next();
      });
    },
  };
}
