/** -----------------------------------------------------------------------
 * @module [RPN]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/24]
 * -----------------------------------------------------------------------
 */

export enum eApgRpnTokens {
  undef = "",
  comma = ",",
  dot = ".",
  plus = "+",
  minus = "-",
  mult = "*",
  mod = "%",
  fig = "#", //rounds the number to the specified figures
  div = "/",
  lPar = "(",
  rPar = ")",
  lSqBrkt = "[",
  rSqBrkt = "]",
  lBrkt = "{",
  rBrkt = "}",
  pi = "pi",
  ne = "e-",
  e = "e",
  exp = "^",
  fact = "!",
  rad = "rad",
  deg = "deg",
  sin = "sin",
  cos = "cos",
  tan = "tan",
  asin = "asin",
  acos = "acos",
  atan = "atan",
  log = "log",
  sqrt = "sqrt",
  abs = "abs",
  rou = "round",
  floor = "floor",
  ceil = "ceil",
  varX = "x",
  varY = "y",
  varZ = "z",
  pop = "pop",
  push = "push",
  popl = "popl",
  pushl = "pushl",
  const = "const",
  var = "?",
  equal = "=",
  lesser= "<",
  lessEq = "<=",
  greater = ">",
  greatEq = ">=",
  true = "true",
  false = "false"

}
