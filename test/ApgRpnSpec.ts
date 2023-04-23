import { Rhum } from "https://deno.land/x/rhum@v1.1.13/mod.ts";

import {
  ApgRpnProcessor,
  ApgRpnFragmenter,
  ApgRpnTokenizer,
  IApgRpnFragmentifyResult,
} from "../mod.ts";

const EPSILON = 0.00000001;

const expressionsMatrix = [
  [ //00
    "5+4",
    "4/2*5",
    "4-2*3",
    "2+6^2",
    "2*3^3",
    "10*2-6",
    "5.2/10*5.0",
    "8%3+4",
  ],
  [ //01
    "5+4+(4*4)",
    "4/2+(2+2)",
    "(2*3)+( 3 /6)",
    "(2)+6/(5%3)",
    "(4.5-2.5)^3",
  ],
  [ //02
    "{[[5+4]/(4*4)/(100*2-6)]}",
    "{{[4*2]-2}+0.25}-{0.25*5+(8-7)}",
    "{((2*3)+(9/3))-[8*2/(4)]}",
  ],
  [ //03
    "cos(rad(90))",
    "sin(rad(-90))",
    "tan(rad(105))",
    "deg(acos(cos(rad(45))))",
    "deg(asin(sin(rad(45))))",
    "deg(atan(tan(rad(45))))",
  ],
  [ //04
    "abs(floor(-1.8))",
    "abs(ceil(-1.8))",
    "abs(round(-1.45))",
    "abs(round(-1.55))",
    "abs(round(-1.554 * 100)/100)",
  ],
  [ //05
    "abs(floor(1.8)*2)",
    "((log(1000))*(sqrt(100)))-(3^3+27^(1/3))",
    "(4*pi * 5.0e2.0 / 50000e-2) / pi",
  ],
  [ //06
    "2x + 5",
    "3a + b -5",
  ],
];

const expressionsFragments = [
  [4, 7, 10, 7, 7, 10, 7, 7],
  [11, 11, 12, 13, 11],
  [29, 36, 30],
  [8, 10, 8, 14, 14, 14],
  [10, 10, 10, 10, 16],
  [11, 35, 26],
  [20],
];

const expressionsResults = [
  [9, 10, -2, 38, 54, 14, 2.6, 6],
  [25, 6, 6.5, 5, 8],
  [9 / 16 / 194, 4, 5],
  [
    Math.cos(90 / 360 * Math.PI),
    Math.sin(-90 / 360 * Math.PI),
    Math.tan(105 / 360 * Math.PI),
    45.0,
    45.0,
    45.0,
  ],
  [2, 1, 1, 2, 1.55],
  [2, 0, 0.0004],
  [0.0004],
];

function TokenizerTester(
  aname: string,
  aexpressions: string[],
  aexpectedFragments: number[],
) {
  Rhum.testSuite(`${aname}`, () => {
    for (let i = 0; i < aexpressions.length; i++) {
      Rhum.testCase(
        `When expression is: ${aexpressions[i]}`,
        () => {
          Rhum.asserts.assertEquals(true, true);
        },
      );
      const tokenizer: ApgRpnTokenizer = new ApgRpnTokenizer();
      const tokenizeResult = tokenizer.Tokenize(aexpressions[i]);
      const fragmenter = new ApgRpnFragmenter();
      const ops: IApgRpnFragmentifyResult = fragmenter.Fragmentify(
        aexpressions[i],
        tokenizeResult.tokens,
      );

      Rhum.testCase(
        `    We expect (${
          aexpectedFragments[i]
        }) fragments and we got (${ops.fragments.length})`,
        () => {
          Rhum.asserts.assertEquals(ops.fragments.length, aexpectedFragments[i]);
        },
      );
    }
  });
}

function t01BasicOperandsTokenizer(arun: boolean) {
  if (!arun) return;
  TokenizerTester(
    t01BasicOperandsTokenizer.name,
    expressionsMatrix[0],
    expressionsFragments[0],
  );
}

function t02BasicParenthesisTokenizer(arun: boolean) {
  if (!arun) return;
  TokenizerTester(
    t02BasicParenthesisTokenizer.name,
    expressionsMatrix[1],
    expressionsFragments[1],
  );
}

function t03ComplexParenthesisTokenizer(arun: boolean) {
  if (!arun) return;
  TokenizerTester(
    t03ComplexParenthesisTokenizer.name,
    expressionsMatrix[2],
    expressionsFragments[2],
  );
}

function t04TrigFunctionsTokenizer(arun: boolean) {
  if (!arun) return;
  TokenizerTester(
    t04TrigFunctionsTokenizer.name,
    expressionsMatrix[3],
    expressionsFragments[3],
  );
}

function t05RoundAndAbsFunctionsTokenizer(arun: boolean) {
  if (!arun) return;
  TokenizerTester(
    t05RoundAndAbsFunctionsTokenizer.name,
    expressionsMatrix[4],
    expressionsFragments[4],
  );
}

function t19ExperimentalFunctionsTokenizer(arun: boolean) {
  if (!arun) return;
  TokenizerTester(
    t19ExperimentalFunctionsTokenizer.name,
    expressionsMatrix[5],
    expressionsFragments[5],
  );
}

function ProcessorTester(
  aname: string,
  aexpressions: string[],
  aexpressionsResults: number[],
) {
  Rhum.testSuite(`${aname}`, () => {
    for (let i = 0; i < aexpressions.length; i++) {
      Rhum.testCase(
        `When expression is: ${aexpressions[i]}`,
        () => {
          Rhum.asserts.assertEquals(true, true);
        },
      );

      const processor: ApgRpnProcessor = new ApgRpnProcessor();
      const tokenizer = new ApgRpnTokenizer();
      const tokenizeResult = tokenizer.Tokenize(aexpressions[i]);
      const fragmenter = new ApgRpnFragmenter();

      const fragmentResult = fragmenter.Fragmentify(aexpressions[i], tokenizeResult.tokens);

      const result = processor.Process(fragmentResult.fragments);
      const epsilon = Math.abs(result.result - aexpressionsResults[i]);
      const r = (epsilon < EPSILON);
      const epsilonMessage = (epsilon === 0)
        ? ""
        : (r)
        ? " inside Epsilon"
        : "";

      Rhum.testCase(
        `    Expected result is (${
          aexpressionsResults[i]
        }) and we got (${result.result})${epsilonMessage}`,
        () => {
          Rhum.asserts.assertEquals(r, true);
        },
      );
    }
  });
}

function t21BasicOperandsProcessor(arun: boolean) {
  if (!arun) return;
  ProcessorTester(
    t21BasicOperandsProcessor.name,
    expressionsMatrix[0],
    expressionsResults[0],
  );
}

function t22BasicParenthesisProcessor(arun: boolean) {
  if (!arun) return;
  ProcessorTester(
    t22BasicParenthesisProcessor.name,
    expressionsMatrix[1],
    expressionsResults[1],
  );
}

function t23ComplexParenthesisProcessor(arun: boolean) {
  if (!arun) return;
  ProcessorTester(
    t23ComplexParenthesisProcessor.name,
    expressionsMatrix[2],
    expressionsResults[2],
  );
}

function t24TrigFunctionsProcessor(arun: boolean) {
  if (!arun) return;
  ProcessorTester(
    t24TrigFunctionsProcessor.name,
    expressionsMatrix[3],
    expressionsResults[3],
  );
}

function t25RoundAndAbsFunctionsProcessor(arun: boolean) {
  if (!arun) return;
  ProcessorTester(
    t25RoundAndAbsFunctionsProcessor.name,
    expressionsMatrix[4],
    expressionsResults[4],
  );
}
function t39ExperimentalFunctionsProcessor(arun: boolean) {
  if (!arun) return;
  ProcessorTester(
    t39ExperimentalFunctionsProcessor.name,
    expressionsMatrix[6],
    expressionsResults[6],
  );
}

function AllTests(arun: boolean) {
  if (!arun) return;

  t01BasicOperandsTokenizer(true);
  t02BasicParenthesisTokenizer(true);
  t03ComplexParenthesisTokenizer(true);
  t04TrigFunctionsTokenizer(true);
  t05RoundAndAbsFunctionsTokenizer(true);

  t19ExperimentalFunctionsTokenizer(true);

  t21BasicOperandsProcessor(true);
  t22BasicParenthesisProcessor(true);
  t23ComplexParenthesisProcessor(true);
  t24TrigFunctionsProcessor(true);
  t25RoundAndAbsFunctionsProcessor(true);

  t39ExperimentalFunctionsProcessor(true);
}

export function ApgUtilsRpnSpec(arun: boolean): void {
  if (!arun) return;

  Rhum.testPlan("Apg Utils Rpn tests", () => {
    AllTests(true);
  });
}
