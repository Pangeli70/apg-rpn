/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import {
  ApgRpnTokenizer,
  IApgRpnTokenizeResult,
  ApgRpnFragmenter,
  IApgRpnFragmentifyResult,
  ApgRpnProcessor,
  IApgRpnEvaluateResult,
  IApgRpnEvaluateLogs,
  IApgRpnFragment,
  IApgRpnVariables
} from "../../mod.ts";

export class ApgRpnEvaluator {

  static readonly precomputed = new Map<string, IApgRpnFragment[]>();

  private _includeLogsInResult = true;
  private _tokenizer: ApgRpnTokenizer;
  private _fragmenter: ApgRpnFragmenter;
  private _processor: ApgRpnProcessor;

  public constructor() {
    this._tokenizer = new ApgRpnTokenizer();
    this._fragmenter = new ApgRpnFragmenter();
    this._processor = new ApgRpnProcessor();
  }

  public Evaluate(
    aexpression: string,
    aincludeLogs = true,
    avariables?: IApgRpnVariables
  ) {

    const logs: IApgRpnEvaluateLogs | undefined = aincludeLogs ? {
      tokenizer: [],
      fragmenter: [],
      processor: []
    } : undefined;

    const r: IApgRpnEvaluateResult = {
      expression: aexpression,
      variables: avariables,
      logs: logs,
      result: NaN
    };

    if (!ApgRpnEvaluator.precomputed.has(aexpression)) {
      const tokenizeResult: IApgRpnTokenizeResult = this._tokenizer.Tokenize(aexpression);
      const fragmentifyResult: IApgRpnFragmentifyResult = this._fragmenter.Fragmentify(aexpression, tokenizeResult.tokens);
      ApgRpnEvaluator.precomputed.set(aexpression, fragmentifyResult.fragments);

      if (aincludeLogs && r.logs) {
        r.logs.tokenizer = tokenizeResult.log;
        r.logs.fragmenter = fragmentifyResult.log;
      }
    }

    const processResult =
      this._processor.Process(ApgRpnEvaluator.precomputed.get(aexpression)!, avariables);

    if (aincludeLogs && r.logs) {
      r.logs.processor = processResult.log;
    }

    r.result = processResult.result;

    return r;
  }

  public EvaluateResult(
    aexpression: string,
    aresult: number,
    aincludeLogs: boolean
  ) {
    const expr = aexpression + "=" + aresult.toString();
    return this.Evaluate(expr, aincludeLogs);
  }
}