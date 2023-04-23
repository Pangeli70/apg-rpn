/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { IApgRpnVariables } from "./IApgRpnVariables.ts";


export interface IApgRpnEvaluateLogs {
    tokenizer: string[];
    fragmenter: string[];
    processor: string[];
}

export interface IApgRpnEvaluateResult {
    expression: string;
    variables?: IApgRpnVariables;
    logs?: IApgRpnEvaluateLogs;
    result: number;
}