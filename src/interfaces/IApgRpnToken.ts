/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { eApgRpnTokens } from "../enums/eApgRpnTokens.ts";
import { eApgRpnTokenType } from "../enums/eApgRpnTokenType.ts";

export interface IApgRpnToken {
  type: eApgRpnTokenType;
  token: string | eApgRpnTokens;
  value?: number;
  pos?: number;
  len?: number;
}
