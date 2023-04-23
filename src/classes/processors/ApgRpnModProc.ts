import { ApgRpnProcBase } from "./ApgRpnProcBase.ts";
import { IApgRpnFragment } from "../../interfaces/IApgRpnFragment.ts";

export class ApgRpnModProc extends ApgRpnProcBase {
    public proc(
        afragment: IApgRpnFragment,
        alocalStack: number[],
        _aglobalStack: number[],
        alog: string[],
    ): number {
        this.checkAtLeast2Args(afragment, alocalStack);
        const l = alocalStack.length;
        if (
            !Number.isInteger(alocalStack[0]) || !Number.isInteger(alocalStack[1])
        ) {
            throw new Error(
                `Expected integer arguments for [${afragment.token}]: received ${alocalStack[0]
                }%${alocalStack[1]}`,
            );
        }
        if (alocalStack[1] === 0) {
            throw new Error(
                `Wrong argument for [${afragment.token}]: division by zero`,
            );
        }
        const r = alocalStack[l - 2] % alocalStack[l - 1];
        alog.push(`${alocalStack[l - 2]} % ${alocalStack[l - 1]} = ${r}`);
        this.storeDoubleArg(r, alocalStack);
        return r;
    }
}
