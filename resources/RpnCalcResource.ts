import { Drash } from "../../deps.ts";
import { ApgRpnEvaluator } from "../../apg/Rpn/mod.ts";
import { IApgEdsResult } from "../../apg/Eds/mod.ts"
import { ApgEdsLoggableResource } from "../Eds/mod.ts";
import { ApgUtils } from "../../apg/Utils/mod.ts";

export class RpnCalcResource extends ApgEdsLoggableResource {
  public paths = ["/rpn/calc"];

  public GET(request: Drash.Request, response: Drash.Response) {
    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name);

    const result: IApgEdsResult = this.eds!;

    try {

      const decodedExpression = this._getExpressionFromQueryString(result);
      const expectedResult = this._getExpectedResultFromQueryString(request);
      const log = this._getLogFlagFromQueryString(request);

      const evaluator = new ApgRpnEvaluator();
      if (expectedResult != -Infinity) {
        result.payload = evaluator.EvaluateResult(decodedExpression, expectedResult, log);
      } 
      else {
        result.payload = evaluator.Evaluate(decodedExpression, log);
      }

    } catch (error) {

      this.unmanagedApiError(response, error, result,);

    }

    this.logEnd();
    this.jsonResult(response, result);
  }

  private _getLogFlagFromQueryString(request: Drash.Request): boolean {
    let r = false;
    const LOG = "log";
    const log = request.queryParam(LOG);
    if (log === null) {
      r = false;
    } else {
      if (!(log === "1" || log === "true")) {
        r = true;
      }
    }
    return r;
  }

  private _getExpressionFromQueryString(result: IApgEdsResult): string {

    const EXPRESSION_PARAM = "expr";

    let expression = result.queryStringParams[EXPRESSION_PARAM];

    if (!expression) {
      expression = "(4*pi * 5.0e2.0 / 50000e-2) / pi";
    }

    return expression;
  }


  private _getExpectedResultFromQueryString(request: Drash.Request) {

    let r = -Infinity;

    const EXPECTED_RESULT_PARAM = "res";

    const expRes = request.queryParam(EXPECTED_RESULT_PARAM);

    if (expRes) {

      if (!ApgUtils.Str_IsNumeric(expRes)) {
        throw new Error(
          `Resource requires that the querystring param [${EXPECTED_RESULT_PARAM}] is a number.`,
        );
      }
      else {
        r = parseFloat(expRes);
      }
    }

    return r;
  }
}
