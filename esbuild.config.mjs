import { nodeExternalsPlugin } from "esbuild-node-externals";
import { build } from "esbuild";
import fs from "fs"

const getFiles = (dir, ext) => {
  return fs.readdirSync("./src", { recursive: true, encoding: "utf-8",  })
  .map(file => {
    return './src/' + file.replace(/\\/g, '/')
  })
  .filter(file => file.split('.').pop() === ext)
}

try {
  const files = getFiles("./src", "ts")

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