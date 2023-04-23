/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { eApgRpnTokens } from "../enums/eApgRpnTokens.ts";
import { IApgRpnFragment } from "../interfaces/IApgRpnFragment.ts";
import { IApgRpnProcessResult } from "../interfaces/IApgRpnProcessResult.ts";
import { IApgRpnProc } from "../interfaces/IApgRpnProc.ts";
import { IApgRpnVariables } from "../interfaces/IApgRpnVariables.ts";
import {
  ApgRpnModProc,
  ApgRpnDivProc,
  ApgRpnPopProc,
  ApgRpnPopLocalProc,
  ApgRpnPushProc,
  ApgRpnPushLocalProc,
  ApgRpnPushLocalConstProc,
  ApgRpnPushLocalVariableProc,
  ApgRpnProcVariableCallback,
  ApgRpnProcOperatorCallback,
  ApgRpnProcFunctionCallback
} from "./processors/mod.ts";
import { ApgUtils } from "../../../Utils/mod.ts";


export class ApgRpnProcessor {

  private readonly _CLASS_NAME = "Apg.Util.Rpn.Processor.";

  private _processors: Map<eApgRpnTokens, IApgRpnProc> = new Map();

  constructor() {
    this._initProcessors();
  }

  private _initProcessors() {
    // stack management
    this._processors.set(eApgRpnTokens.push,
      new ApgRpnPushProc());

    this._processors.set(eApgRpnTokens.pushl,
      new ApgRpnPushLocalProc(),
    );

    this._processors.set(eApgRpnTokens.const,
      new ApgRpnPushLocalConstProc(),
    );

    this._processors.set(eApgRpnTokens.pop,
      new ApgRpnPopProc());

    this._processors.set(eApgRpnTokens.popl,
      new ApgRpnPopLocalProc());

    // Operators
    this._processors.set(eApgRpnTokens.plus,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => avalue1 + avalue2));

    this._processors.set(eApgRpnTokens.mult,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => avalue1 * avalue2));

    this._processors.set(eApgRpnTokens.div,
      new ApgRpnDivProc()
    );

    this._processors.set(eApgRpnTokens.mod,
      new ApgRpnModProc());

    this._processors.set(eApgRpnTokens.fig,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => ApgUtils.Math_RoundToSignificant(avalue1, avalue2)));

    this._processors.set(eApgRpnTokens.exp,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => Math.pow(avalue1, avalue2)));

    this._processors.set(eApgRpnTokens.greatEq,
      new ApgRpnProcOperatorCallback((avalue1: number, avalue2: number) => (avalue1 >= avalue2) ? 1 : 0));

    this._processors.set(eApgRpnTokens.lessEq,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => (avalue1 <= avalue2) ? 1 : 0));

    this._processors.set(eApgRpnTokens.equal,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => (avalue1 === avalue2) ? 1 : 0));

    this._processors.set(eApgRpnTokens.greater,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => (avalue1 > avalue2) ? 1 : 0));

    this._processors.set(eApgRpnTokens.lesser,
      new ApgRpnProcOperatorCallback(
        (avalue1: number, avalue2: number) => (avalue1 < avalue2) ? 1 : 0));

    // Functions with callback
    this._processors.set(eApgRpnTokens.sqrt,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.sqrt(avalue)));

    this._processors.set(eApgRpnTokens.log,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.log10(avalue)));

    this._processors.set(eApgRpnTokens.abs,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.abs(avalue)));

    this._processors.set(eApgRpnTokens.rad,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => avalue / 180 * Math.PI));

    this._processors.set(eApgRpnTokens.deg,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => avalue * 180 / Math.PI));

    this._processors.set(eApgRpnTokens.sin,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.sin(avalue)));

    this._processors.set(eApgRpnTokens.cos,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.cos(avalue)));

    this._processors.set(eApgRpnTokens.tan,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.tan(avalue)));

    this._processors.set(eApgRpnTokens.asin,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.asin(avalue)));

    this._processors.set(eApgRpnTokens.acos,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.acos(avalue)));

    this._processors.set(eApgRpnTokens.atan,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.atan(avalue)));

    this._processors.set(eApgRpnTokens.rou,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.round(avalue)));

    this._processors.set(eApgRpnTokens.floor,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.floor(avalue)));

    this._processors.set(eApgRpnTokens.ceil,
      new ApgRpnProcFunctionCallback(
        (avalue: number) => Math.ceil(avalue))
    );

    // Variables
    this._processors.set(eApgRpnTokens.var,
      new ApgRpnPushLocalVariableProc());

    this._processors.set(eApgRpnTokens.varX,
      new ApgRpnProcVariableCallback(
        (avariables: IApgRpnVariables) => {
          const val: number | undefined = avariables[eApgRpnTokens.varX];
          return (val !== undefined) ? val : NaN;
        }));

    this._processors.set(eApgRpnTokens.varY,
      new ApgRpnProcVariableCallback(
        (avariables: IApgRpnVariables) => {
          const val: number | undefined = avariables[eApgRpnTokens.varY];
          return (val !== undefined) ? val : NaN;
        }));

    this._processors.set(eApgRpnTokens.varZ,
      new ApgRpnProcVariableCallback(
        (avariables: IApgRpnVariables) => {
          const val: number | undefined = avariables[eApgRpnTokens.varZ];
          return (val !== undefined) ? val : NaN;
        }));


  }

  public Process(
    afragments: IApgRpnFragment[],
    avariables?: IApgRpnVariables,
  ): IApgRpnProcessResult {

    const r: IApgRpnProcessResult = {
      log: [],
      result: 0
    }

    const start = performance.now();

    const globalStack: number[] = [];
    const localStack: number[] = [];

    for (let i = 0; i < afragments.length; i++) {
      const fragment = afragments[i];
      const processor = this._processors.get(fragment.token);
      if (!processor) {
        throw new Error(
          `${this._CLASS_NAME}${this.Process.name}: (${fragment.token}) is not included in the map of the RPN processors`,
        );
      } else {
        processor.proc(
          fragment,
          localStack,
          globalStack,
          r.log,
          avariables,
        );
      }
    }

    const totalTime = ApgUtils.Math_RoundToSignificant(performance.now() - start, 4);
    r.log.push(
      `Total processing time is: ${totalTime}ms`,
    );

    r.result = globalStack[globalStack.length - 1];
    return r;
  }


}
