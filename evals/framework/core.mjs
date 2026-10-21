function readPath(value, path) {
  return path.split('.').reduce((current, key) => current?.[key], value);
}

function compare(actual, grader) {
  if (grader.type === 'equals') return Object.is(actual, grader.expected);
  if (grader.type === 'includes') return String(actual ?? '').includes(grader.expected);
  if (grader.type === 'matches') return new RegExp(grader.pattern, grader.flags).test(String(actual ?? ''));
  if (grader.type === 'truthy') return Boolean(actual);
  throw new Error(`Unknown grader type: ${grader.type}`);
}

export function gradeCriterion(criterion, observation) {
  const actual = readPath(observation, criterion.path);
  const passed = compare(actual, criterion.grader);
  return {
    id: criterion.id,
    description: criterion.description,
    path: criterion.path,
    actual,
    expected: criterion.grader.expected ?? criterion.grader.pattern ?? true,
    weight: criterion.weight,
    earned: passed ? criterion.weight : 0,
    passed
  };
}

export async function runSuite(suite, adapter) {
  const cases = [];
  for (const evalCase of suite.cases) {
    let observation;
    let executionError;
    try {
      observation = await adapter.run(evalCase);
    } catch (error) {
      executionError = error instanceof Error ? error.message : String(error);
      observation = { executionError };
    }
    const criteria = evalCase.criteria.map((criterion) => gradeCriterion(criterion, observation));
    const earned = criteria.reduce((total, criterion) => total + criterion.earned, 0);
    const available = criteria.reduce((total, criterion) => total + criterion.weight, 0);
    cases.push({
      id: evalCase.id,
      name: evalCase.name,
      score: available === 0 ? 0 : earned / available,
      earned,
      available,
      passed: !executionError && earned === available,
      executionError,
      criteria
    });
  }
  const earned = cases.reduce((total, evalCase) => total + evalCase.earned, 0);
  const available = cases.reduce((total, evalCase) => total + evalCase.available, 0);
  const score = available === 0 ? 0 : earned / available;
  return {
    id: suite.id,
    name: suite.name,
    threshold: suite.threshold,
    score,
    passed: score >= suite.threshold && cases.every((evalCase) => !evalCase.executionError),
    earned,
    available,
    cases
  };
}

export function createReport(suites, threshold = 0.9) {
  const earned = suites.reduce((total, suite) => total + suite.earned, 0);
  const available = suites.reduce((total, suite) => total + suite.available, 0);
  const score = available === 0 ? 0 : earned / available;
  return {
    generatedAt: new Date().toISOString(),
    score,
    threshold,
    passed: score >= threshold && suites.every((suite) => suite.passed),
    totals: {
      suites: suites.length,
      cases: suites.reduce((total, suite) => total + suite.cases.length, 0),
      criteria: suites.reduce((total, suite) => total + suite.cases.reduce((count, evalCase) => count + evalCase.criteria.length, 0), 0),
      earned,
      available
    },
    suites
  };
}
