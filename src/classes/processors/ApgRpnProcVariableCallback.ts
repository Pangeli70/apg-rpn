import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";
import { IApgRpnVariables} from "../../interfaces/IApgRpnVariables.ts";


export class ApgRpnProcVariableCallback extends ApgRpnProcBase {
  private _callback: (avariables: IApgRpnVariables) => number;

  constructor(acallback: (avariables: IApgRpnVariables) => number) {
    super();
    this._callback = acallback;
  }

  proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
    avariables: IApgRpnVariables,
  ): number {
    const variableValue = this._callback(avariables);
    alocalStack.push(variableValue);
    this.logSingleArgOp(alog, afragment.token, variableValue, variableValue);
    return variableValue;
  }
}


