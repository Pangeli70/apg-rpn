/** -----------------------------------------------------------------------
 * @module [Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/04/02]
 * -----------------------------------------------------------------------
 */
import { settings } from "../../globals.ts";
import { Drash } from "../../deps.ts";
import {
  TApgDheDictionary,
  ApgDhe
} from "../../apg/Dhe/mod.ts"

import { ApgEdsLoggableResource } from "../Eds/mod.ts";

export class RpnMenuResource extends ApgEdsLoggableResource {

  public paths = ["/rpn"];

  public GET(request: Drash.Request, response: Drash.Response) {
    response.headers.set("Content-Type", "text/html");

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const templatPageValues: TApgDheDictionary = {
      APG_PAGE_TITLE: "RPN",
      APG_PAGE_BAR: this._getBar(),
      APG_PAGE_CONTENT: this._getContent(),
      APG_PAGE_RELEASE_DATE: "2022/04/02"
    }

    const html = ApgDhe.Process(
      settings.DHE_PICO_TEMPLATE,
      templatPageValues
    );

    this.logEnd();
    response.html(html);

  }

  private _getContent(): string {
    const contentValues: TApgDheDictionary = {
      APG_MENU_LINKS: [

        {
          href: '/rpn/examples',
          caption: "Examples",
          desc: "List some examples of possible usageof the Calc route"
        },
        {
          href: '/rpn/calc',
          caption: "Calc",
          desc: "Evaluates querystring expressions through a GET route"
        },
        {
          href: '/rpn/interactive',
          caption: "Interactive",
          desc: "Evalutes expressions submitted through a form and a POST route"
        },
        {
          href: '/rpn/variables',
          caption: "Variables",
          desc: "Evaluates expressions with variables that return multiple values submitted through a form and a POST route"
        },
        {
          href: '/rpn/variables/ranges',
          caption: "Variables ranges",
          desc: "Evaluates expressions with  variables  that return  multiple range values submitted through a form and a POST route"
        }
      ]
    };

    const r = ApgDhe.Process(
      settings.DHE_COMPONENTS_PATH + "ApgDheH3Menu.html",
      contentValues
    );

    return r;
  }

  private _getBar(): string {
    const barValues: TApgDheDictionary = {
      APG_BAR_LINKS: [
        {
          caption: "Home",
          href: "/"
        }
      ]
    };

    const r = ApgDhe.Process(
      settings.DHE_COMPONENTS_PATH + "ApgDheBar.html",
      barValues
    );

    return r;
  }

}
