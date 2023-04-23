import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";


export class ApgRpnProcOperatorCallback extends ApgRpnProcBase {
    private _callback: (avalue1: number, avalue2: number) => number;
  
    constructor(acallback: (avalue1: number, avalue2: number) => number) {
      super();
      this._callback = acallback;
    }
  
    proc(
      afragment: IApgRpnFragment,
      alocalStack: number[],
      aglobalStack: number[],
      alog: string[],
    ): number {
      return this.procDoubleArgCallback(
        afragment,
        alocalStack,
        aglobalStack,
        alog,
        this._callback,
      );
    }
  }
  