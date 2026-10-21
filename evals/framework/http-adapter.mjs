async function readBody(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createHttpAdapter(baseUrl) {
  return {
    async run(evalCase) {
      const responses = {};
      for (const step of evalCase.steps) {
        const response = await fetch(`${baseUrl}${step.path}`, {
          method: step.method,
          headers: step.body ? { 'content-type': 'application/json' } : undefined,
          body: step.body ? JSON.stringify(step.body) : undefined
        });
        responses[step.key] = { status: response.status, body: await readBody(response) };
      }
      return { responses };
    }
  };
}
