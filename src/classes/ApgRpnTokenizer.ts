/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { ApgUtils } from "../../../Utils/mod.ts";
import { eApgRpnTokens } from "../enums/eApgRpnTokens.ts";
import { eApgRpnTokenType } from "../enums/eApgRpnTokenType.ts";
import { IApgRpnToken } from "../interfaces/IApgRpnToken.ts";
import { IApgRpnTokenizeResult } from "../interfaces/IApgRpnTokenizeResult.ts";

export class ApgRpnTokenizer {

  private readonly _CLASS_NAME = "ApgRpnTokenizer.";

  operatorTokens: string[] = [];
  brktTokens: string[] = [];
  functionTokens: string[] = [];
  specialTokens: string[] = [];
  variablesTokens: string[] = [];

  constructor() {
    this._initOperatorTokens();
    this._initBracketTokens();
    this._initVariablesTokens();
    this._initSpecialTokens();
    this._initFunctionTokens();
  }

  private _initOperatorTokens() {
    // warnign the order MATTERS! determines the precedence of the operators
    this.operatorTokens.push(eApgRpnTokens.exp);
    this.operatorTokens.push(eApgRpnTokens.div);
    this.operatorTokens.push(eApgRpnTokens.mult);
    this.operatorTokens.push(eApgRpnTokens.mod);
    this.operatorTokens.push(eApgRpnTokens.fig);

    // this.operatorTokens.push(eApgRpnTokens.minus); This is handled in the special tokens
    this.operatorTokens.push(eApgRpnTokens.plus);
    this.operatorTokens.push(eApgRpnTokens.greatEq);
    this.operatorTokens.push(eApgRpnTokens.lessEq);
    this.operatorTokens.push(eApgRpnTokens.equal);
    this.operatorTokens.push(eApgRpnTokens.greater);
    this.operatorTokens.push(eApgRpnTokens.lesser);
  }

  private _initBracketTokens() {
    this.brktTokens.push(eApgRpnTokens.lPar);
    this.brktTokens.push(eApgRpnTokens.rPar);
  }

  private _initVariablesTokens() {
    this.variablesTokens.push(eApgRpnTokens.varX);
    this.variablesTokens.push(eApgRpnTokens.varY);
    this.variablesTokens.push(eApgRpnTokens.varZ);
  }

  private _initSpecialTokens() {
    // warnign the order MATTERS!
    this.specialTokens.push(eApgRpnTokens.comma);
    this.specialTokens.push(eApgRpnTokens.pi);
    this.specialTokens.push(eApgRpnTokens.ne);
    this.specialTokens.push(eApgRpnTokens.e);
    this.specialTokens.push(eApgRpnTokens.lSqBrkt);
    this.specialTokens.push(eApgRpnTokens.lBrkt);
    this.specialTokens.push(eApgRpnTokens.rSqBrkt);
    this.specialTokens.push(eApgRpnTokens.rBrkt);
    this.specialTokens.push(eApgRpnTokens.minus); // this is handled as  "+(-1)*"
    this.specialTokens.push(eApgRpnTokens.true);
    this.specialTokens.push(eApgRpnTokens.false);
  }

  private _initFunctionTokens() {
    // WARNING THE ORDER MATTERS! sub strings must follow eg. acos must be before than cos
    this.functionTokens.push(eApgRpnTokens.sqrt); // OK
    this.functionTokens.push(eApgRpnTokens.log); // OK
    this.functionTokens.push(eApgRpnTokens.rad); // OK
    this.functionTokens.push(eApgRpnTokens.deg); // OK
    this.functionTokens.push(eApgRpnTokens.asin); // OK
    this.functionTokens.push(eApgRpnTokens.acos); // OK
    this.functionTokens.push(eApgRpnTokens.atan); // OK
    this.functionTokens.push(eApgRpnTokens.sin); // OK
    this.functionTokens.push(eApgRpnTokens.cos); // OK
    this.functionTokens.push(eApgRpnTokens.tan); // OK
    this.functionTokens.push(eApgRpnTokens.abs); // OK
    this.functionTokens.push(eApgRpnTokens.rou); // OK
    this.functionTokens.push(eApgRpnTokens.floor); // OK
    this.functionTokens.push(eApgRpnTokens.ceil); // OK
  }

  public Tokenize(aexpression: string): IApgRpnTokenizeResult {

    const r: IApgRpnTokenizeResult = {
      tokens: [],
      log: []
    }

    const start = performance.now();

    r.log.push(`Initial expression: ${aexpression}`);

    let expression = this._normalizeSpecialTokens(aexpression);
    r.log.push(`After special tokens normalization: ${expression}`);

    r.tokens = this._identifyTokens(expression);
    r.log.push(`After identification found: ${r.tokens.length} tokens`);

    this._normalizeParenthesis(r.tokens, expression);
    expression = "";
    r.tokens.map((value) => {
      expression += value.token;
    });
    r.log.push(`After parenthesis token normalization: ${expression}`);

    this._normalizeVariables(r.tokens);
    expression = "";
    r.tokens.map((value) => {
      expression += value.token;
    });
    r.log.push(`After variables token normalization: ${expression}`);

    this._verifySyntax(r.tokens, expression);
    r.log.push(
      `Expression syntax seems correct, total number of tokens is: ${r.tokens.length}`,
    );

    const totalTime = ApgUtils.Math_RoundToSignificant(performance.now() - start, 4);
    r.log.push(
      `Total tokenization time is: ${totalTime}ms`,
    );

    return r;
  }

  private _normalizeSpecialTokens(aexpression: string): string {
    const deblankedExpression = aexpression.split(" ").join("");
    let r = deblankedExpression.toLowerCase();

    this.specialTokens.forEach((token) => {
      switch (token) {
        case eApgRpnTokens.comma: {
          // remove comma
          r = r.split(eApgRpnTokens.comma).join(`.`);
          break;
        }
        case eApgRpnTokens.pi: {
          // replace pi value
          r = r.split(eApgRpnTokens.pi).join(`${Math.PI}`);
          break;
        }
        case eApgRpnTokens.ne: {
          // manage negative exponent
          const fragments = r.split(eApgRpnTokens.ne);
          r = fragments[0];
          for (let i = 1; i < fragments.length; i++) {
            const leftCharCode: number = fragments[i - 1].charCodeAt(
              fragments[i - 1].length - 1,
            );
            const rightCharCode: number = fragments[i].charCodeAt(0);
            if (
              ApgUtils.IsDigitChar(leftCharCode) &&
              ApgUtils.IsDigitChar(rightCharCode)
            ) {
              r += `/10^`;
            } else {
              r += eApgRpnTokens.ne;
            }
            r += fragments[i];
          }
          break;
        }
        // manage positive exponent
        case eApgRpnTokens.e: {
          const fragments = r.split(eApgRpnTokens.e);
          r = fragments[0];
          for (let i = 1; i < fragments.length; i++) {
            const leftFragment = fragments[i - 1];
            const leftCharCode: number = leftFragment.charCodeAt(
              leftFragment.length - 1,
            );
            const rightCharCode: number = fragments[i].charCodeAt(0);
            if (
              ApgUtils.IsDigitChar(leftCharCode) &&
              ApgUtils.IsDigitChar(rightCharCode)
            ) {
              r += `*10^`;
            } else {
              r += eApgRpnTokens.e;
            }
            r += fragments[i];
          }
          break;
        }
        case eApgRpnTokens.lSqBrkt: {
          r = r.split(eApgRpnTokens.lSqBrkt).join(`(`);
          break;
        }
        case eApgRpnTokens.lBrkt: {
          r = r.split(eApgRpnTokens.lBrkt).join(`(`);
          break;
        }
        case eApgRpnTokens.rSqBrkt: {
          r = r.split(eApgRpnTokens.rSqBrkt).join(`)`);
          break;
        }
        case eApgRpnTokens.rBrkt: {
          r = r.split(eApgRpnTokens.rBrkt).join(`)`);
          break;
        }
        case eApgRpnTokens.minus: {
          // warning we need to perform this after parenthesis normalization
          r = this._preProcessMinusToken(r);
          break;
        }
        case eApgRpnTokens.true: {
          r = r.split(eApgRpnTokens.true).join(`1`);
          break;
        }
        case eApgRpnTokens.false: {
          r = r.split(eApgRpnTokens.false).join(`0`);
          break;
        }
      }
    });
    return r;
  }

  private _preProcessMinusToken(aexpression: string): string {
    let r = "";
    const fragments = aexpression.split(eApgRpnTokens.minus);
    r = fragments[0];
    for (let i = 1; i < fragments.length; i++) {
      const leftFragment = fragments[i - 1];
      let leftCharCode = 0;
      if (leftFragment.length != 0) {
        leftCharCode = leftFragment.charCodeAt(leftFragment.length - 1);
      }
      const rigthFragment = fragments[i];
      let rightCharCode = 0;
      if (leftFragment.length != 0) {
        rightCharCode = rigthFragment.charCodeAt(0);
      }
      // minus is first character
      if (leftCharCode == 0) {
        r += "-1*";
      } // minus is last character so we trhow syntax error
      else if (rightCharCode == 0) {
        throw new Error(
          `${this._CLASS_NAME}${this._preProcessMinusToken.name}: A spare "-" sign at the end of the expression is not allowed`,
        );
      } // previous char is a left opened parenthesis
      else if (leftCharCode == "(".charCodeAt(0)) {
        r += "-1*";
      } else {
        r += "+-1*";
      }

      r += fragments[i];
    }
    return r;
  }

  private _identifyTokens(aexpression: string): IApgRpnToken[] {
    const r: IApgRpnToken[] = [];
    let cursor = 0;
    let lastTokenLength = 1;
    let numberFound = false;
    do {
      let potentialToken = aexpression.substring(cursor, cursor + lastTokenLength);
      if (ApgUtils.Str_IsNumeric(potentialToken)) {
        // maybe there are more numbers
        numberFound = true;
        // but if we are at the end store the number
        if ((cursor + lastTokenLength) == aexpression.length) {
          const token: IApgRpnToken = {
            type: eApgRpnTokenType.VALUE,
            token: potentialToken,
            pos: cursor,
            len: lastTokenLength,
            value: parseFloat(potentialToken),
          };
          r.push(token);
          cursor += lastTokenLength;
          lastTokenLength = 0;
        }
      } else {
        if (numberFound) {
          // we found something else after a number
          // so store the number
          const token: IApgRpnToken = {
            type: eApgRpnTokenType.VALUE,
            token: potentialToken.substring(0, potentialToken.length - 1),
            pos: cursor,
            len: lastTokenLength - 1,
          };
          token.value = parseFloat(token.token);
          r.push(token);
          cursor += lastTokenLength - 1;
          lastTokenLength = 0;
          numberFound = false;
        } else {
          let opTokenFound = false;
          if (lastTokenLength == 1) {
            // look for brackets
            for (let i = 0; i < this.brktTokens.length; i++) {
              const element: string = this.brktTokens[i];

              if (potentialToken == element) {
                const token: IApgRpnToken = {
                  type: eApgRpnTokenType.PARENTHESIS,
                  token: potentialToken,
                  pos: cursor,
                  len: lastTokenLength,
                };
                r.push(token);
                cursor += lastTokenLength;
                lastTokenLength = 0;
                opTokenFound = true;
                break;
              }
            }
            // look for operators
            if (!opTokenFound) {
              if (potentialToken == '<' || potentialToken == '>') {
                const nextCharIndex = cursor + 1;
                const nextChar = aexpression[nextCharIndex];
                if (nextChar == "=") {
                  potentialToken = potentialToken + nextChar;
                  lastTokenLength++;
                }
              }

              for (let i = 0; i < this.operatorTokens.length; i++) {
                const operator: string = this.operatorTokens[i];

                if (potentialToken == operator) {
                  const token: IApgRpnToken = {
                    type: eApgRpnTokenType.OPERATOR,
                    token: potentialToken,
                    pos: cursor,
                    len: lastTokenLength,
                  };
                  r.push(token);
                  cursor += lastTokenLength;
                  lastTokenLength = 0;
                  opTokenFound = true;
                  break;
                }
              }

            }
            // look for minus
            if (!opTokenFound) {
              if (potentialToken == "-") {
                const newPotentialToken = aexpression.substring(
                  cursor,
                  lastTokenLength + 1,
                );
                if (newPotentialToken == "-1") {
                  const token: IApgRpnToken = {
                    type: eApgRpnTokenType.VALUE,
                    token: newPotentialToken,
                    pos: cursor,
                    len: lastTokenLength + 1,
                    value: -1,
                  };
                  r.push(token);
                  cursor += lastTokenLength + 1;
                  lastTokenLength = 0;
                  opTokenFound = true;
                }
              }
            }
            // look for variables
            if (!opTokenFound) {
              for (let i = 0; i < this.variablesTokens.length; i++) {
                const element: string = this.variablesTokens[i];

                if (potentialToken == element) {
                  const token: IApgRpnToken = {
                    type: eApgRpnTokenType.VARIABLE,
                    token: potentialToken,
                    pos: cursor,
                    len: lastTokenLength,
                  };
                  r.push(token);
                  cursor += lastTokenLength;
                  lastTokenLength = 0;
                  opTokenFound = true;
                  break;
                }
              }
            }
          } else {
            for (let i = 0; i < this.functionTokens.length; i++) {
              const element: string = this.functionTokens[i];
              if (potentialToken == element) {
                const token: IApgRpnToken = {
                  type: eApgRpnTokenType.FUNCTION,
                  token: potentialToken,
                  pos: cursor,
                  len: lastTokenLength,
                };
                r.push(token);
                cursor += lastTokenLength;
                lastTokenLength = 0;
                break;
              }
            }
          }
        }
      }
      lastTokenLength++;
    } while ((cursor + lastTokenLength) <= aexpression.length);
    return r;
  }

  private _normalizeVariables(atokens: IApgRpnToken[]) {
    let cursor = 0;

    const insertableTokens: any = {
      [eApgRpnTokens.lPar]: {
        type: eApgRpnTokenType.PARENTHESIS,
        token: eApgRpnTokens.lPar,
        pos: 0,
        len: 0,
      },
      [eApgRpnTokens.rPar]: {
        type: eApgRpnTokenType.PARENTHESIS,
        token: eApgRpnTokens.rPar,
        pos: 0,
        len: 0,
      },
      [eApgRpnTokens.mult]: {
        type: eApgRpnTokenType.OPERATOR,
        token: eApgRpnTokens.mult,
        pos: 0,
        len: 0,
      },
      [eApgRpnTokens.const]: {
        type: eApgRpnTokenType.VALUE,
        token: eApgRpnTokens.mult,
        value: 1,
        pos: 0,
        len: 0,
      }
    }

    do {
      const variableToken: IApgRpnToken = atokens[cursor];

      if (variableToken.type === eApgRpnTokenType.VARIABLE) {
        // variable is not first token
        if (cursor != 0) {
          const prevToken = atokens[cursor - 1];
          if (
            prevToken.type == eApgRpnTokenType.VALUE ||
            prevToken.type == eApgRpnTokenType.VARIABLE
          ) {
            atokens.splice(cursor, 0, insertableTokens[eApgRpnTokens.mult]);
            cursor++;
          }
        }
      }
      cursor++;

    } while (cursor < atokens.length);
  }

  private _normalizeParenthesis(
    atokens: IApgRpnToken[],
    aexpression: string,
  ) {
    let depth = 0;
    for (let i = 0; i < atokens.length; i++) {
      const token: IApgRpnToken = atokens[i];
      if (token.type == eApgRpnTokenType.PARENTHESIS) {
        if (token.token == eApgRpnTokens.lPar) depth++;
        if (token.token == eApgRpnTokens.rPar) depth--;
        if (depth < 0) {
          throw new Error(
            `${this._CLASS_NAME}${this._normalizeParenthesis.name}: wrong closed parenthesis inside (${aexpression}) expression`,
          );
        }
      }
    }
    if (depth != 0) {
      throw new Error(
        `${this._CLASS_NAME}${this._normalizeParenthesis.name}: Wrong number of parenthesis inside (${aexpression}) expression there are (${depth}) not-closed ones`,
      );
    }
    let cursor = 0;
    let delta = 1;
    do {
      const functionToken: IApgRpnToken = atokens[cursor];
      if (functionToken.type === eApgRpnTokenType.FUNCTION) {
        if (atokens[cursor + delta].token != eApgRpnTokens.lPar) {
          throw new Error(
            `${this._CLASS_NAME}${this._normalizeParenthesis.name}: Missing parenthesis after function (${functionToken}) inside (${aexpression}) expression`,
          );
        }
        const lpar = { ...atokens[cursor + delta] };
        delta++;
        let depth = 1;
        while (depth != 0) {
          const token: IApgRpnToken = atokens[cursor + delta];
          if (token.type == eApgRpnTokenType.PARENTHESIS) {
            if (token.token == eApgRpnTokens.lPar) {
              depth++;
            } else if (token.token == eApgRpnTokens.rPar) {
              depth--;
            }
          }
          delta++;
        }
        delta--;
        const rpar = { ...atokens[cursor + delta] };
        if (cursor == 0) {
          atokens.unshift(lpar);
        } else {
          atokens.splice(cursor, 0, lpar);
        }
        delta += 2;
        atokens.splice(cursor + delta, 0, rpar);
        cursor += delta;
        delta = 1;
      } else {
        cursor++;
      }
    } while ((cursor + delta) < atokens.length);
  }

  private _verifySyntax(atokens: IApgRpnToken[], aexpression: string) {
    for (let i = 1; i < atokens.length - 1; i++) {
      const prevToken: IApgRpnToken = atokens[i - 1];
      const token: IApgRpnToken = atokens[i];
      const nextToken: IApgRpnToken = atokens[i + 1];

      if (i == 1) {
        if (
          !(
            prevToken.type == eApgRpnTokenType.VALUE ||
            prevToken.type == eApgRpnTokenType.VARIABLE ||
            prevToken.type == eApgRpnTokenType.FUNCTION ||
            prevToken.token == eApgRpnTokens.lPar
          )
        ) {
          throw new Error(
            `${this._CLASS_NAME}(${this._verifySyntax.name}: First token (${token.token}) is wrong in expression ${aexpression}`,
          );
        }
      }

      if (token.type == eApgRpnTokenType.OPERATOR) {
        if (
          !(
            (
              prevToken.type == eApgRpnTokenType.VALUE ||
              prevToken.type == eApgRpnTokenType.VARIABLE ||
              prevToken.token == eApgRpnTokens.rPar
            ) &&
            (
              nextToken.type == eApgRpnTokenType.VALUE ||
              nextToken.type == eApgRpnTokenType.VARIABLE ||
              nextToken.token == eApgRpnTokens.lPar
            )
          )
        ) {
          throw new Error(
            `${this._CLASS_NAME}(${this._verifySyntax.name}: Wrong statment for (${token.token}) operator in expression ${aexpression}`,
          );
        }
      }

      if (token.type == eApgRpnTokenType.FUNCTION) {
        if (
          !(
            nextToken.type == eApgRpnTokenType.PARENTHESIS &&
            nextToken.token == eApgRpnTokens.lPar
          )
        ) {
          throw new Error(
            `${this._CLASS_NAME}(${this._verifySyntax.name}: Missing parenthesis for (${token.token}) function in expression ${aexpression}`,
          );
        }
      }

      if (i == atokens.length - 2) {
        if (
          !(
            nextToken.type == eApgRpnTokenType.VALUE ||
            nextToken.type == eApgRpnTokenType.VARIABLE ||
            nextToken.token == eApgRpnTokens.rPar
          )
        ) {
          throw new Error(
            `${this._CLASS_NAME}${this._verifySyntax.name}: Last token (${token.token}) is wrong in expression ${aexpression}`,
          );
        }
      }
    }
  }
}
