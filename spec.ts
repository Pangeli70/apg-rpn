import { ApgUtilsRpnSpec } from "./test/ApgRpnSpec.ts";

export function ApgUtilsRpnSpecSuite(arun: boolean) {
  if (!arun) return;
  ApgUtilsRpnSpec(true);
}
