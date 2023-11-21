import { nodeExternalsPlugin } from "esbuild-node-externals";
import { build } from "esbuild";

build({
  entryPoints: ["src/functions/register.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  sourcemap: true,
  tsconfig: "tsconfig.json",
  plugins: [nodeExternalsPlugin()],
  outfile: "dist/functions/register.js"
}).catch(err => {
  console.error(err) //really same as default behaviour. Should we remove this?
  process.exit(1)
})