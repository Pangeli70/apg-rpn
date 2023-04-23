import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";


export class ApgRpnProcFunctionCallback extends ApgRpnProcBase {
  private _callback: (avalue: number) => number;

  constructor(acallback: (avalue: number) => number) {
    super();
    this._callback = acallback;
  }

  proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    aglobalStack: number[],
    alog: string[],
  ): number {
    return this.procSingleArgCallback(
      afragment,
      alocalStack,
      aglobalStack,
      alog,
      this._callback,
    );
  }
}

