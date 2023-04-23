import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";
import { IApgRpnProc } from "../../interfaces/IApgRpnProc.ts";
import { IApgRpnVariables } from "../../interfaces/IApgRpnVariables.ts";

export abstract class ApgRpnProcBase implements IApgRpnProc {
  abstract proc(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    aglobalStack: number[],
    alog: string[],
    avariables?: IApgRpnVariables,
  ): number;

  protected checkAtLeast1Arg(
    afragment: IApgRpnFragment,
    alocalStack: number[],
  ) {
    if (alocalStack.length < 1) {
      throw new Error(
        `Wrong number of arguments for ${afragment.token}(): expected at least 1, received ${alocalStack.length} `,
      );
    }
  }

  protected checkAtLeast2Args(
    afragment: IApgRpnFragment,
    alocalStack: number[],
  ) {
    if (alocalStack.length < 2) {
      throw new Error(
        `Wrong number of arguments for [${afragment.token}]: expected at least 2, received ${alocalStack.length} `,
      );
    }
  }

  protected storeSingleArg(aval: number, alocalStack: number[]) {
    alocalStack.splice(alocalStack.length - 1, 1);
    alocalStack.push(aval);
  }

  protected storeDoubleArg(aval: number, alocalStack: number[]) {
    alocalStack.splice(alocalStack.length - 2, 2);
    alocalStack.push(aval);
  }

  protected logSingleArgOp(
    alog: string[],
    atoken: string,
    avalue: number,
    aresult: number,
  ) {
    alog.push(`${atoken}(${avalue}) = ${aresult}`);
  }

  protected logDoubleArgOp(
    alog: string[],
    atoken: string,
    avalue2: number,
    avalue1: number,
    aresult: number,
  ) {
    alog.push(`(${avalue2} ${atoken} ${avalue1}) = ${aresult}`);
  }

  protected procSingleArgCallback(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
    acallback: (avalue: number) => number,
  ): number {
    this.checkAtLeast1Arg(afragment, alocalStack);
    const value = alocalStack[alocalStack.length - 1];
    const result = acallback(value);
    this.storeSingleArg(result, alocalStack);
    this.logSingleArgOp(alog, afragment.token, value, result);
    return result;
  }

  protected procDoubleArgCallback(
    afragment: IApgRpnFragment,
    alocalStack: number[],
    _aglobalStack: number[],
    alog: string[],
    acallback: (avalue1: number, avalue2: number) => number,
  ): number {
    this.checkAtLeast2Args(afragment, alocalStack);
    const value2 = alocalStack[alocalStack.length - 2];
    const value1 = alocalStack[alocalStack.length - 1];
    const result = acallback(value2, value1);
    this.storeDoubleArg(result, alocalStack);
    // Warning precedence of operators!! value 2 is deeper in the stack
    this.logDoubleArgOp(alog, afragment.token, value2, value1, result);
    return result;
  }
}
