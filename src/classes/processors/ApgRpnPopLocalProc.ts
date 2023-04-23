import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";

export class ApgRpnPopLocalProc extends ApgRpnProcBase {
  public proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
  ): number {
    const index = <number>afragment.value;
    const value: number = alocalStack[index];
    //const value: number = alocalStack[alocalStack.length - 1];
    // alocalStack.splice(afragment.value, 1);
    alocalStack.push(value);
    alog.push(`${afragment.token} <- [${index}] = ${value}`);
    return value;
  }
}
