import nodeExternalsPlugin from "esbuild-node-externals";
import { build } from "esbuild";

build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
  outfile: "dist/app.js"
}).catch(err => {
  console.error(err) //really same as default behaviour. Should we remove this?
  process.exit(1)
})