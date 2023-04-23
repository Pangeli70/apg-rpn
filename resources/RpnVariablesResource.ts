import { settings } from "../../globals.ts";
import { Drash } from "../../deps.ts";
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

export class RpnVariablesResource extends ApgEdsLoggableResource {

  public paths = ["/rpn/variables"];


  public GET(request: Drash.Request, response: Drash.Response) {

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const contentComponentTemplate =
      settings.DHE_COMPONENTS_PATH + "rpn/RpnDheVariables.html";

    const templatePageValues: TApgDheDictionary = {
      APG_PAGE_TITLE: "RPN Variables",
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

      const xvariableValues: number[] = this._getVariablesFromPostBody(request, "x");
      const yvariableValues: number[] = this._getVariablesFromPostBody(request, "y");
      const zvariableValues: number[] = this._getVariablesFromPostBody(request, "z");

      const includeLogsInResult = this._getLogFlagFromPostBody(request);

      const evaluator = new ApgRpnEvaluator();

      for (let i = 0; i < xvariableValues.length; i++) {

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


  private _getVariablesFromPostBody(request: Drash.Request, aname: string): number[] {
    const VARIABLES_PARAM = aname + "_variables";
    const variables = request.bodyParam(VARIABLES_PARAM);

    if (!variables) {
      throw new Error(
        `Resource requires the [${VARIABLES_PARAM}] body param in the request.`,
      );
    }

    if (typeof (variables) != "string") {
      throw new Error(
        `Resource requires that the body param [${VARIABLES_PARAM}] is of type string.`,
      );
    }

    const deBlankedVariables = variables.split("+").join(" ");
    const decodedVariables: string = decodeURIComponent(deBlankedVariables);
    const arrayOfStringVariables: string[] = decodedVariables.split(",");
    const arrayOfVariables: number[] = [];
    arrayOfStringVariables.forEach((element) => {
      arrayOfVariables.push(parseFloat(element));
    });
    return arrayOfVariables;
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
