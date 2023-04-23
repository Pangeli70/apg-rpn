import { settings } from "../../globals.ts";
import { Drash } from "../../deps.ts";
import {
  ApgRpnEvaluator
} from "../../apg/Rpn/mod.ts";
import { IApgEdsResult } from "../../apg/Eds/mod.ts";
import {
  ApgDhe,
  TApgDheDictionary
} from "../../apg/Dhe/mod.ts";
import {
  ApgEdsLoggableResource
} from "../Eds/mod.ts";

export class RpnInteractiveResource extends ApgEdsLoggableResource {

  public paths = ["/rpn/interactive"];


  public GET(request: Drash.Request, response: Drash.Response) {

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const contentComponentTemplate = settings.DHE_COMPONENTS_PATH + "rpn/RpnDheInteractive.html";

    const templatePageValues: TApgDheDictionary = {
      APG_PAGE_TITLE: "RPN Interactive",
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
    this.logBegin(this.POST.name)
    const result: IApgEdsResult = this.eds!;

    try {

      const decodedExpression = this._getDecodedExpressionFromPostBody(request);
      const includeLogsInResult = this._getLogFlagFromPostBody(request);

      const evaluator = new ApgRpnEvaluator();
      result.payload = evaluator.Evaluate(decodedExpression, includeLogsInResult);

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

    //const deBlankedExpression = expression.split("+").join(" ");
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