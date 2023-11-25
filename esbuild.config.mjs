import { nodeExternalsPlugin } from "esbuild-node-externals";
import { build } from "esbuild";
import fs from "fs"

try {
  const files = fs.readdirSync("./src", { recursive: true, encoding: "utf-8",  })
  .map(file => {
    return './src/' + file.replace(/\\/g, '/')
  })
  .filter(file => fs.statSync(file).isFile())


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