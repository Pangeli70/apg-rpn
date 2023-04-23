import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";


export class ApgRpnPushLocalConstProc extends ApgRpnProcBase {
  public proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
  ): number {
    alocalStack.push(<number>afragment.value);
    alog.push(`${afragment.token} -> ${afragment.value}`);
    return NaN;
  }
}



