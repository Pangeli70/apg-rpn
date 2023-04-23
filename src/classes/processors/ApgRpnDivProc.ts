import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";

export class ApgRpnDivProc extends ApgRpnProcBase {
    public proc(
      afragment: IApgRpnFragment,
      alocalStack: number[],
      _aglobalStack: number[],
      alog: string[],
    ): number {
      this.checkAtLeast2Args(afragment, alocalStack);
      const l = alocalStack.length;
      if (alocalStack[l - 1] === 0) {
        throw new Error(
          `Wrong argument for [${afragment.token}]: division by zero`,
        );
      }
      const r = alocalStack[l - 2] / alocalStack[l - 1];
      alog.push(`${alocalStack[l - 2]} / ${alocalStack[l - 1]} = ${r}`);
      this.storeDoubleArg(r, alocalStack);
      return r;
    }
  }
  