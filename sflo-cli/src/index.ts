#!/usr/bin/env node
import { cac } from "cac";
import { startHost } from "@semantic-flow/host";

const cli = cac("sflo");

cli
  .command("serve", "Start the SFLO host")
  .option("--config <path>", "Path to sflo.config.json")
  .action(async (opts) => {
    await startHost(opts.config);
  });

cli.help();
cli.parse();
