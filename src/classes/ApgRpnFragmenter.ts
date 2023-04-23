/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

import { eApgRpnTokenType } from "../enums/eApgRpnTokenType.ts";
import { eApgRpnTokens } from "../enums/eApgRpnTokens.ts";
import { IApgRpnToken } from "../interfaces/IApgRpnToken.ts";
import { IApgRpnFragment } from "../interfaces/IApgRpnFragment.ts";
import { IApgRpnFragmentifyResult } from "../interfaces/IApgRpnFragmentifyResult.ts";
import { ApgUtils } from "../../../Utils/mod.ts";

export class ApgRpnFragmenter {

  private readonly _CLASS_NAME = "Apg.Util.Rpn.Fragmenter.";

  operatorTokens: string[] = [];

  constructor() {
    this._initOperatorTokens();
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

  public Fragmentify(
    aexpression: string,
    atokens: IApgRpnToken[],
  ): IApgRpnFragmentifyResult {

    const r: IApgRpnFragmentifyResult = {
      fragments: [],
      log: []
    };

    const start = performance.now();

    r.log.push(`Tokenized expression: ${aexpression}`);

    const subExpressions: IApgRpnToken[][] = this._getTokenSubExpressions(
      atokens,
    );
    r.log.push(
      `Total number of sub expressions is: ${subExpressions.length}`,
    );

    r.log.push(`Fragments recognition:`);
    let subExpressionIndex = 0;
    for (let i = 0; i < subExpressions.length; i++) {
      const subExpression: IApgRpnToken[] = subExpressions[i];
      let subExpressionString = "";
      subExpression.map((token) => {
        subExpressionString += token.token;
      });

      const fragments: IApgRpnFragment[] = this._getFragments(
        subExpression,
        subExpressionIndex,
      );
      r.fragments.splice(r.fragments.length, 0, ...fragments);

      r.log.push(
        ` ${subExpressionIndex}) ${subExpressionString}: [${fragments.length}] fragments`,
      );

      subExpressionIndex++;
    }
    r.log.push(
      `The total number of fragments in fragments stack is: ${r.fragments.length}`,
    );

    const totalTime = ApgUtils.Math_RoundToSignificant(performance.now() - start, 4);
    r.log.push(
      `The total fragmentation time is: ${totalTime} ms`,
    );

    return r;
  }

  private _getTokenSubExpressions(
    atokens: IApgRpnToken[],
  ): IApgRpnToken[][] {

    const r: IApgRpnToken[][] = [];
    let done = false;
    let cursor = 0;
    let lastOpenPar = 0;
    let subExpressionIndex = 0;

    do {
      const token = atokens[cursor];

      if (token.token === eApgRpnTokens.lPar) {
        lastOpenPar = cursor;
        cursor++;
      } else if (token.token === eApgRpnTokens.rPar) {
        const subExpr: IApgRpnToken[] = [];
        for (let i: number = lastOpenPar + 1; i < cursor; i++) {
          subExpr.push(atokens[i]);
        }
        r.push(subExpr);

        atokens.splice(lastOpenPar, cursor - lastOpenPar + 1);

        const token: IApgRpnToken = {
          type: eApgRpnTokenType.STACK,
          token: eApgRpnTokens.pop,
          value: subExpressionIndex,
          pos: 0,
          len: 0,
        };

        subExpressionIndex++;
        atokens.splice(lastOpenPar, 0, token);
        cursor = 0;
      } else {
        cursor++;
      }

      if (atokens.length == 1) {
        done = true;
      }
      // reached the end of the list without parenthesis so the entire expression is a subexpression
      if (cursor == atokens.length) {
        done = true;
        r.push(atokens);
      }
    } while (!done);

    return r;
  }

  private _getFragments(
    atokens: IApgRpnToken[],
    asubExprIndex: number,
  ): IApgRpnFragment[] {

    const r: IApgRpnFragment[] = [];
    let cursor = 1;
    let done = false;
    let localStackIndex = 0;

    // initially try to identify functions that have precedence over operators
    if (atokens.length >= 2) {
      do {
        const prevToken: IApgRpnToken = atokens[cursor - 1];
        const token: IApgRpnToken = atokens[cursor];

        if (prevToken.type == eApgRpnTokenType.FUNCTION) {
          const valFragment: IApgRpnFragment = {
            token: eApgRpnTokens.pop,
            value: <number>token.value,
          };
          r.push(valFragment);
          const funcFragment: IApgRpnFragment = {
            token: <eApgRpnTokens>prevToken.token,
            value: 0,
          };
          r.push(funcFragment);
          atokens.splice(cursor - 1, 2);
          const newToken: IApgRpnToken = {
            type: eApgRpnTokenType.STACK,
            token: eApgRpnTokens.pushl,
            value: localStackIndex,
          };
          localStackIndex++;
          atokens.splice(cursor - 1, 0, newToken);
          cursor = 0;
        }
        cursor++;
        if (cursor >= atokens.length) {
          done = true;
        }
      } while (!done);
    }

    // then try to parse all the remaining tokens looking for operators in order of precedence
    if (atokens.length >= 3) {
      for (let i = 0; i < this.operatorTokens.length; i++) {
        // check if there are further tokens to process for operators
        if (atokens.length < 3) break;

        const aopToken = this.operatorTokens[i];
        cursor = 1;
        done = false;

        do {
          const prevToken: IApgRpnToken = atokens[cursor - 1];
          const cursorToken: IApgRpnToken = atokens[cursor];
          const nextToken: IApgRpnToken = atokens[cursor + 1];

          if (cursorToken.type == eApgRpnTokenType.OPERATOR) {
            if (cursorToken.token == aopToken) {
              let token: eApgRpnTokens;
              let value: number | string;
              if (prevToken.type == eApgRpnTokenType.VALUE) {
                token = eApgRpnTokens.const;
                value = <number>prevToken.value;
              } else if (prevToken.type == eApgRpnTokenType.VARIABLE) {
                token = eApgRpnTokens.var;
                value = <string>prevToken.token;
              } else if (prevToken.type == eApgRpnTokenType.STACK) {
                token = prevToken.token == eApgRpnTokens.popl
                  ? eApgRpnTokens.popl
                  : eApgRpnTokens.pop;
                value = <number>prevToken.value;
              } else {
                throw new Error(
                  `${this._CLASS_NAME}${this._getFragments.name} unexpected prev token (${prevToken.type}/${prevToken.token}) searching for operators`
                );
              }
              const prevValFragment: IApgRpnFragment = {
                token: token,
                value: value,
              };
              r.push(prevValFragment);

              if (nextToken.type == eApgRpnTokenType.VALUE) {
                token = eApgRpnTokens.const;
                value = <number>nextToken.value;
              } else if (nextToken.type == eApgRpnTokenType.VARIABLE) {
                token = eApgRpnTokens.var;
                value = <string>nextToken.token;
              } else if (nextToken.type == eApgRpnTokenType.STACK) {
                token = nextToken.token == eApgRpnTokens.popl
                  ? eApgRpnTokens.popl
                  : eApgRpnTokens.pop;
                value = <number>nextToken.value;
              } else {
                throw new Error(
                  `${this._CLASS_NAME}${this._getFragments.name} unexpected next token (${prevToken.type}/${prevToken.token}) searching for operators `
                );
              }
              const nextValFragment: IApgRpnFragment = {
                token: token,
                value: value,
              };
              r.push(nextValFragment);

              const opFragment: IApgRpnFragment = {
                token: <eApgRpnTokens>cursorToken.token,
                value: "",
              };
              r.push(opFragment);
              const stackFragment: IApgRpnFragment = {
                token: eApgRpnTokens.pushl,
                value: localStackIndex,
              };
              r.push(stackFragment);

              atokens.splice(cursor - 1, 3);
              const newToken: IApgRpnToken = {
                type: eApgRpnTokenType.STACK,
                token: eApgRpnTokens.popl,
                value: localStackIndex,
              };
              atokens.splice(cursor - 1, 0, newToken);
              localStackIndex++;
              // cursor = 0;
            } else {
              cursor++;
            }
          } else {
            cursor++;
          }

          if (cursor >= atokens.length) {
            done = true;
          }
        } while (!done);
      }
    }

    // in the end search in the remaining tokens for a value
    if (atokens.length == 1) {
      let token: eApgRpnTokens;
      let value: number | string = "";
      const lastToken = atokens[0];
      if (lastToken.type == eApgRpnTokenType.VALUE) {
        token = eApgRpnTokens.const;
        value = <number>lastToken.value;
      } else if (lastToken.type == eApgRpnTokenType.VARIABLE) {
        token = eApgRpnTokens.var;
        value = <string>lastToken.token;
      }
      else if (lastToken.type == eApgRpnTokenType.STACK) {
        // Do nothing more the only possible remaining stack tokens are pushl and popl
        if (
          lastToken.token == eApgRpnTokens.pushl ||
          lastToken.token == eApgRpnTokens.popl
        ) {
          token = eApgRpnTokens.undef;
        }
        else {
          throw new Error(
            `${this._CLASS_NAME}${this._getFragments.name} unexpected last token type (${lastToken.type}/${lastToken.token}) searching for last token`
          );
        }
      }
      else {
        throw new Error(
          `${this._CLASS_NAME}${this._getFragments.name} unexcpected tokens: received (${atokens.length}) instead than 1 searching for last token`
        );
      }
      if (token != eApgRpnTokens.undef) {
        const lastFragment: IApgRpnFragment = {
          token: token,
          value: value,
        };
        r.push(lastFragment);
      }
    }
    else {
      //something is wrong can't be there more than residual token
      throw new Error(
        `${this._CLASS_NAME}${this._getFragments.name} unexpected token (${atokens[1].type}/${atokens[1].token}) searching for residual token`
      );
    }

    // store result of local stack on global stack
    const stackFragment: IApgRpnFragment = {
      token: eApgRpnTokens.push,
      value: asubExprIndex,
    };

    r.push(stackFragment);

    return r;
  }
}
