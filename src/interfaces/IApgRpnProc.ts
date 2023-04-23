/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { IApgRpnFragment } from "./IApgRpnFragment.ts";
import { IApgRpnVariables } from "./IApgRpnVariables.ts";

export interface IApgRpnProc {
  proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    aglobalStack: number[],
    alog: string[],
    avariables?: IApgRpnVariables,
  ): number;
}
