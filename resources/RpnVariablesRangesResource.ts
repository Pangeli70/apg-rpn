import { settings } from "../../globals.ts";
import { Drash } from "../../deps.ts";
import { ApgUtils } from '../../apg/Utils/src/classes/ApgUtils.ts';
import {
  ApgRpnEvaluator,
  IApgRpnVariables,
  IApgRpnEvaluateResult,
  eApgRpnTokens
} from "../../apg/Rpn/mod.ts";
import { IApgEdsResult } from "../../apg/Eds/mod.ts";
import {
  ApgDhe,
  TApgDheDictionary
} from "../../apg/Dhe/mod.ts";
import {
  ApgEdsLoggableResource
} from "../Eds/mod.ts";

export class RpnVariablesRangesResource extends ApgEdsLoggableResource {
  public paths = ["/rpn/variables/ranges"];

  public GET(request: Drash.Request, response: Drash.Response) {

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const contentComponentTemplate =
      settings.DHE_COMPONENTS_PATH + "rpn/RpnDheVariablesRanges.html";

    const templatePageValues: TApgDheDictionary = {
      APG_PAGE_TITLE: "RPN Variables ranges",
      APG_PAGE_BAR: this._getBar(),
      APG_PAGE_CONTENT: this._getContent(contentComponentTemplate),
      APG_PAGE_RELEASE_DATE: "2021/05/15 - 2022/05/21"
    }

    const html = ApgDhe.Process(
      settings.DHE_W3_TEMPLATE,
      templatePageValues
    );

    this.logEnd();
    response.html(html);

  }


  public POST(request: Drash.Request, response: Drash.Response) {

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const result: IApgEdsResult = this.eds!;

    try {

      const payload: IApgRpnEvaluateResult[] = [];

      const decodedExpression = this._getDecodedExpressionFromPostBody(request);

      const xrange: number[] = this._getRangeFromBody(request, "x");
      const yrange: number[] = this._getRangeFromBody(request, "y");
      const zrange: number[] = this._getRangeFromBody(request, "z");
      const steps: number = this._getStepsFromBody(request);

      const includeLogsInResult = this._getLogFlagFromPostBody(request);

      const xvariableValues = this._getVariableValues(xrange, steps);
      const yvariableValues = this._getVariableValues(yrange, steps);
      const zvariableValues = this._getVariableValues(zrange, steps);

      const evaluator = new ApgRpnEvaluator();

      for (let i = 0; i < steps; i++) {

        const variables: IApgRpnVariables = {
          [eApgRpnTokens.varX]: xvariableValues[i],
          [eApgRpnTokens.varY]: yvariableValues[i],
          [eApgRpnTokens.varZ]: zvariableValues[i],
        }

        const iterationResult = evaluator.Evaluate(
          decodedExpression,
          includeLogsInResult,
          variables,
        );

        payload.push(iterationResult);
      }

      result.payload = payload;

    } catch (error) {

      this.unmanagedApiError(response, error, result,);

    }

    this.logEnd();
    this.jsonResult(response, result);
  }


  private _getDecodedExpressionFromPostBody(request: Drash.Request): string {

    const EXPRESSION_PARAM = "expression";
    const expression = request.bodyParam(EXPRESSION_PARAM);

    if (!expression) {
      throw new Error(
        `Resource requires the [${EXPRESSION_PARAM}] body param in the request.`,
      );
    }

    if (typeof (expression) != "string") {
      throw new Error(
        `Resource requires that the body param [${EXPRESSION_PARAM}] is of type string.`,
      );
    }

    const deBlankedExpression = expression.split(" ").join("");
    const decodedExpression: string = decodeURIComponent(deBlankedExpression);

    return decodedExpression;
  }


  private _getLogFlagFromPostBody(request: Drash.Request): boolean {

    const NO_LOG_PARAM = "no_log";
    const noLog = request.bodyParam(NO_LOG_PARAM);
    let r = true;

    if (noLog != undefined && typeof (noLog) == "string" && noLog === "on") {
      r = false;
    }

    return r;
  }


  private _getRangeFromBody(request: Drash.Request, aname: string): number[] {

    const VARIABLE_MIN = "min_" + aname;
    const variableMin = request.bodyParam(VARIABLE_MIN);

    if (!variableMin) {
      throw new Error(
        `Resource requires the [${VARIABLE_MIN}] body param in the request.`,
      );
    }

    if (typeof (variableMin) != "string") {
      throw new Error(
        `Resource requires that the body param [${VARIABLE_MIN}] is of type string.`,
      );
    }

    const decodedVariableMin: string = decodeURIComponent(variableMin);

    if (!ApgUtils.Str_IsNumeric(decodedVariableMin)) {
      throw new Error(
        `Resource requires that the body param [${VARIABLE_MIN}] is a number.`,
      );
    }

    const minValue = parseFloat(decodedVariableMin);


    const VARIABLE_MAX = "max_" + aname;
    const variableMax = request.bodyParam(VARIABLE_MAX);

    if (!variableMax) {
      throw new Error(
        `Resource requires the [${VARIABLE_MAX}] body param in the request.`,
      );
    }

    if (typeof (variableMax) != "string") {
      throw new Error(
        `Resource requires that the body param [${VARIABLE_MAX}] is of type string.`,
      );
    }

    const decodedVariableMax: string = decodeURIComponent(variableMax);

    if (!ApgUtils.Str_IsNumeric(decodedVariableMax)) {
      throw new Error(
        `Resource requires that the body param [${VARIABLE_MAX}] is a number.`,
      );
    }

    if (typeof (decodedVariableMax) != "string") {
      throw new Error(
        `Resource requires that the body param [${VARIABLE_MAX}] is of type string.`,
      );
    }

    const maxValue = parseFloat(decodedVariableMax);

    const range: number[] = [minValue, maxValue];

    return range;
  }


  private _getStepsFromBody(request: Drash.Request): number {

    const STEPS = "steps";
    const steps = request.bodyParam(STEPS);

    if (!steps) {
      throw new Error(
        `Resource requires the [${STEPS}] body param in the request.`,
      );
    }

    if (typeof (steps) != "string") {
      throw new Error(
        `Resource requires that the body param [${STEPS}] is of type string.`,
      );
    }

    const decodedSteps: string = decodeURIComponent(steps);

    if (!ApgUtils.Str_IsNumeric(decodedSteps)) {
      throw new Error(
        `Resource requires that the body param [${STEPS}] is a number.`,
      );
    }

    const stepsValue = parseFloat(decodedSteps);

    return stepsValue;
  }


  private _getVariableValues(arange: number[], asteps: number) {

    const r: number[] = [];

    asteps--;
    const delta = arange[1] - arange[0];
    const step = delta / asteps;

    r.push(arange[0]);

    for (let i = 0; i < asteps; i++) {
      const val = arange[0] + step * (i + 1)
      r.push(val);
    }

    r.push(arange[1]);

    return r;
  }

  private _getBar(): string {
    const barValues: TApgDheDictionary = {
      APG_BAR_LINKS: [
        {
          caption: "Home",
          href: "/",
          w3css: "true"
        },
        {
          caption: "Rpn",
          href: "/rpn",
          w3css: "true"
        },
        {
          caption: "Rpn Examples",
          href: "/rpn/examples",
          w3css: "true"
        }
      ]
    };

    const r = ApgDhe.Process(
      settings.DHE_COMPONENTS_PATH + "ApgDheBar.html",
      barValues
    );

    return r;
  }

  private _getContent(apath: string) {
    const r = ApgDhe.Process(apath, {});
    return r;
  }

}
