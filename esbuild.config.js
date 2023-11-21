import { nodeExternalsPlugin } from "esbuild-node-externals";
import { build } from "esbuild";
import fs from "fs/promises"

try {
  const files = await fs.readdir("./src", { recursive: true, encoding: "utf-8" })


  build({
    entryPoints: files,
    bundle: true,
    minify: true,
    platform: "node",
    sourcemap: true,
    tsconfig: "tsconfig.json",
    plugins: [nodeExternalsPlugin()],
    outdir: "dist",
  })
}
catch (err) {
  console.log(err)
  process.exit(1)
}