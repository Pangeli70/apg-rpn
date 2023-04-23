import { settings } from "../../globals.ts";
import { Drash } from "../../deps.ts";
import {
  ApgDhe,
  TApgDheDictionary
} from "../../apg/Dhe/mod.ts";
import {
  ApgEdsLoggableResource
} from "../Eds/mod.ts";

export class RpnExamplesResource extends ApgEdsLoggableResource {
  public paths = ["/rpn/examples"];

  public GET(request: Drash.Request, response: Drash.Response) {

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const contentComponentTemplate =
      settings.DHE_COMPONENTS_PATH + "rpn/RpnDheExamples.html";

    const templatePageValues: TApgDheDictionary = {
      APG_PAGE_TITLE: "RPN Examples",
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
