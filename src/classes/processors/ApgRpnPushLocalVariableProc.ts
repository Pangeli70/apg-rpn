import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";
import { IApgRpnVariables } from "../../interfaces/IApgRpnVariables.ts";

export class ApgRpnPushLocalVariableProc extends ApgRpnProcBase {
  public proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
    avariables: IApgRpnVariables,
  ): number {
    const valName = <string>afragment.value;
    const varValue: number | undefined = (<any>avariables)[valName];
    const value = varValue !== undefined ? varValue : NaN;
    alocalStack.push(value);
    alog.push(`${afragment.token} -> ${afragment.value} = ${value}`);
    return NaN;
  }
}


