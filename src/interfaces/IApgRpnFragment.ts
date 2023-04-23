/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { eApgRpnTokens } from "../enums/eApgRpnTokens.ts";

export interface IApgRpnFragment {
  token: eApgRpnTokens;
  value: number | string;
}
