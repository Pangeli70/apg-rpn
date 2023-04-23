import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";

export class ApgRpnPopProc extends ApgRpnProcBase {
  public proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    aglobalStack: number[],
    alog: string[],
  ): number {
    const value: number = aglobalStack[<number>afragment.value];
    alocalStack.push(value);
    alog.push(`${afragment.token} <= ${value}`);
    return NaN;
  }
}

