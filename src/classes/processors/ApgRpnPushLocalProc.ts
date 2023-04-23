import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";


export class ApgRpnPushLocalProc extends ApgRpnProcBase {
  public proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
  ): number {
    const index = <number>afragment.value;
    // all this stuff is already executed by the storexxxArg of ProcBase so do nothing
    /*const last = alocalStack.length - 1;
    alocalStack[index] = alocalStack[last];
    const delta = last - index;
    alocalStack.splice(index, delta);*/
    alog.push(`${afragment.token} -> [${index}] = ${alocalStack[index]}`);
    return NaN;
  }
}


