/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * -----------------------------------------------------------------------
 */

export { eApgRpnTokenType } from "./src/enums/eApgRpnTokenType.ts";
export { eApgRpnTokens } from "./src/enums/eApgRpnTokens.ts";

export type { IApgRpnToken } from "./src/interfaces/IApgRpnToken.ts";
export type { IApgRpnTokenizeResult } from "./src/interfaces/IApgRpnTokenizeResult.ts";

export type { IApgRpnFragment } from "./src/interfaces/IApgRpnFragment.ts";
export type { IApgRpnFragmentifyResult } from "./src/interfaces/IApgRpnFragmentifyResult.ts";

export type { IApgRpnVariables } from "./src/interfaces/IApgRpnVariables.ts";
export type { IApgRpnProcessResult } from "./src/interfaces/IApgRpnProcessResult.ts";

export type {
    IApgRpnEvaluateResult,
    IApgRpnEvaluateLogs
} from "./src/interfaces/IApgRpnEvaluateResult.ts";

export { ApgRpnFragmenter } from "./src/classes/ApgRpnFragmenter.ts";
export { ApgRpnTokenizer } from "./src/classes/ApgRpnTokenizer.ts";
export { ApgRpnProcBase } from "./src/classes/processors/mod.ts";
export { ApgRpnProcessor } from "./src/classes/ApgRpnProcessor.ts";
export { ApgRpnEvaluator } from "./src/classes/ApgRpnEvaluator.ts";