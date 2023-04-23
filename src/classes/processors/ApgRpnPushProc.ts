import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";


export class ApgRpnPushProc extends ApgRpnProcBase {
  public proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    aglobalStack: number[],
    alog: string[],
  ): number {
    const value: number = alocalStack[alocalStack.length - 1];
    aglobalStack.push(value);
    alocalStack.splice(0, alocalStack.length);
    alog.push(`${afragment.token} => ${value}`);
    return NaN;
  }
}

