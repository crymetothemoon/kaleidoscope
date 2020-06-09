#!/usr/bin/env ts-node
import { cp, isdir, readdir, rm, spit } from "nda/dist/node/fs"
import { join } from "nda/dist/node/path"
import { filter, map } from "nda/dist/isomorphic/iterator"
import { call, SpawnArgs } from "nda/dist/node/sub_process"

const time = new Date().toISOString()
const dist_dir = "./dist"
const artifacts_dir = "./artifacts"
const diff_guarantee = join(artifacts_dir, "build_record.txt")

const chdir = () => {
  process.chdir(__dirname)
}

const run = async (args: SpawnArgs) => {
  const code = await call(args)
  if (code != 0) {
    process.exit(code)
  }
}

const git_clone = async () => {
  if (await isdir(artifacts_dir)) {
    return
  } else {
    const uri = `process.argv`
    await run({ cmd: "git", args: ["clone", uri, artifacts_dir] })
  }
}

const git_commit = async () => {
  const msg = `CI - ${time}`
  await run({
    cmd: "git",
    args: ["add", "-A"],
    opts: { cwd: artifacts_dir },
  })
  await run({
    cmd: "git",
    args: ["commit", "-m", msg],
    opts: { cwd: artifacts_dir },
  })
  await run({
    cmd: "git",
    args: ["push", "--force"],
    opts: { cwd: artifacts_dir },
  })
}

const copy = async () => {
  const prev = await readdir(1, artifacts_dir)
  const prev__artifacts = filter((n) => !n.endsWith(".git"), [
    ...prev.dirs,
    ...prev.files,
  ])
  await Promise.all(map(rm, prev__artifacts))
  await cp(dist_dir, artifacts_dir)
  await spit(time, diff_guarantee)
}

const main = async () => {
  chdir()
  await git_clone()
  await run({ cmd: "npm", args: ["run", "build"] })
  await copy()
  await git_commit()
}

main()

