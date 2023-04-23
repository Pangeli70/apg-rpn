/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { IApgRpnToken } from "./IApgRpnToken.ts";


export interface IApgRpnTokenizeResult {

    tokens: IApgRpnToken[];
    log: string[];

}