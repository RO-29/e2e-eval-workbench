# Jev naming research for the eval workbench

Research date: 2026-10-22

## Conclusion

Use **Jev** as the visible name for the optional semantic grader.

Define it once as **Jev, TypeSafe AI's System One model**. After that first definition, use the names by role:

- **Jev** makes the semantic judgment.
- **TypeSafe AI** provides the hosted service, console, API, and SDKs.
- **System One** names the model class and the API operation.

Do not replace every TypeSafe name with Jev. Names such as `TYPESAFE_API_KEY`, `TypeSafeClient`, `api.typesafe.ai`, and the TypeSafe Playground are official product names. Keep them unchanged.

## What each name means

| Name | Meaning | Use in the workbench |
| --- | --- | --- |
| TypeSafe AI | The provider and API or SDK brand | Use for the console, API, SDK, account, key, and source links |
| System One | A class of models that returns typed decisions, and the API operation at `POST /v1/systemone` | Use when the guide explains the architecture or wire contract |
| Jev | TypeSafe AI's flagship model and first System One model | Use when the guide names the semantic grader or says what evaluates the reply |

The official introduction says that Jev is TypeSafe's flagship model and the first System One model. It says that Jev evaluates typed questions against state and returns structured results. See the [TypeSafe introduction](https://docs.typesafe.ai/introduction).

The official quick start consistently tells the reader how to use **Jev**. It calls Jev TypeSafe's System One model. It then directs the reader to the TypeSafe console, SDK, and API. See the [TypeSafe quick start](https://docs.typesafe.ai/introduction/quickstart).

The official JavaScript repository calls its package the TypeSafe AI JavaScript SDK. Its client method is `systemOne()`. The provider name, API operation, and model name have separate roles. See the [official JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js).

## Is Jev alone clear enough?

No. A beginner cannot infer what Jev is from the name alone.

The first use on each standalone page must define Jev. Use this short definition:

> Jev is TypeSafe AI's System One model for typed semantic judgments.

After this definition, **Jev grader** or **Jev semantic grader** is accurate and short.

Do not use **TypeSafe Jev** as the normal name. The official sources use **Jev** for the model and **TypeSafe AI** for the provider. The phrase **Jev by TypeSafe AI** is acceptable for the first introduction, but it is too long for repeated headings.

Do not label the integration only **System One**. System One is broader than Jev. It describes the model class and the endpoint contract. The actual model in the example is Jev.

## Current model identifiers

The official model page currently lists these versioned IDs:

| Name | Current meaning |
| --- | --- |
| `jev-1.13.0` | Current stable version behind `jev-latest` |
| `jev-1.14.0` | Newer release behind `jev-preview` |
| `jev-latest` | Moving stable alias and the SDK default |
| `jev-preview` | Moving alias for the newest release, including previews |

The official model page says that aliases can move without a code change. It recommends a versioned ID when thresholds depend on one model version. It also says that each response reports the versioned model ID. See [TypeSafe model IDs and aliases](https://docs.typesafe.ai/models#aliases).

The model page contains a time-sensitive state on 2026-10-22. It lists Jev 1.14 as the newest release, but `jev-latest` still points to Jev 1.13. This is valid because `jev-preview` points to Jev 1.14. Do not describe `jev-latest` as the newest Jev version.

For the beginner example, `jev-latest` matches the official quick start and reduces setup work. For a repeatable eval baseline, pin a versioned ID after calibration and record the response `model` field. The page should state this distinction next to the request example.

The API also provides `GET /v1/models` for names that the account can send. See the [official OpenAPI document](https://api.typesafe.ai/openapi.json).

## Recommended main-page wording

Use this label:

> Optional Jev grader

Use this heading:

> Use Jev for semantic checks.

Use this short body:

> Jev is TypeSafe AI's System One model for typed semantic judgments. Use it for prompt completeness, safety, and clarity. Keep exact backend and UI checks in code. Jev grades the reply. It does not generate the reply.

Link the callout to `/reusable-eval/#jev`.

This wording keeps the summary short. It also tells a beginner what Jev is before the page uses the short name.

## Recommended detailed-guide wording

Use **Jev** in the navigation and heading:

- Navigation: `Jev`
- Eyebrow: `Optional semantic grader`
- Heading: `Use Jev for semantic prompt grading.`

Start the section with:

> Jev is TypeSafe AI's System One model. It evaluates typed questions about a prompt reply. It does not replace the prompt model, the case runner, or exact checks.

Use **Jev** for model actions:

- Jev evaluates the reply.
- Jev returns typed judgments and probabilities.
- Jev does not generate the tested reply.
- Jev grades all five trials.

Use **TypeSafe API** for service actions:

- Send one Jev request through the TypeSafe API.
- Create a TypeSafe API key.
- Test questions in the TypeSafe Playground.
- Save the model ID returned by the TypeSafe API.

Use **System One** only when the guide explains the model class or endpoint contract:

- Jev is a System One model.
- The request uses `POST /v1/systemone`.
- The SDK method is `systemOne()`.

## Existing page claims to change

The current page has the correct technical boundary. It keeps exact backend and UI checks in code. It also says that the semantic grader does not generate the prompt reply. Keep those claims.

Change these visible labels and sentences:

| Current text | Recommended text | Reason |
| --- | --- | --- |
| `TypeSafe` in the navigation | `Jev` | The section describes the model that grades a reply |
| `Use TypeSafe where exact matching stops.` | `Use Jev for semantic checks.` | Jev performs the judgment |
| `TypeSafe can return typed judgments` | `Jev returns typed judgments and probabilities` | The model returns the judgment |
| `TypeSafe grades the reply` | `Jev grades the reply` | The provider and model no longer share one role |
| `Use TypeSafe for the judgment that code cannot make.` | `Use Jev for semantic prompt grading.` | This is clearer and does not imply that code cannot make any semantic check |
| `Use TypeSafe for semantic grading.` | `Use Jev for semantic grading.` | Jev is the grader |
| `one TypeSafe request` | `one Jev request through the TypeSafe API` | This names the model and transport |
| `TypeSafe request example` | `Jev request through the TypeSafe API` | This is precise for a beginner |
| `Use the correct TypeSafe entry point.` | `Call Jev through the TypeSafe API.` | `/hook` is a console route, while `/v1/systemone` is the API operation |

Change the section anchor from `#typesafe` to `#jev`. Update the main-page link at the same time. A temporary hidden `#typesafe` compatibility anchor is optional if the old public link must continue to work.

Keep these names unchanged:

- `TYPESAFE_API_KEY`
- `TypeSafeClient`
- `https://api.typesafe.ai/v1/systemone`
- TypeSafe Playground
- TypeSafe console
- TypeSafe API
- TypeSafe AI in source attribution and data-handling statements

## Accuracy changes to make with the naming update

The request example uses `jev-latest`. Add one sentence that says it is a moving alias. State that CI should pin a versioned Jev ID after the team calibrates the grader.

Do not say that `jev-latest` always means the newest Jev release. The official model page currently maps it to Jev 1.13 while `jev-preview` maps to Jev 1.14.

Do not say that every Jev answer includes a separate confidence field. The official confidence guide says that Choice and Score include `confidence`. Noul returns one probability, and a value near `0.5` signals uncertainty. See the [TypeSafe confidence guide](https://docs.typesafe.ai/confidence).

Do not call Jev an eval framework. In this project, Jev is one optional model-based grader inside the reusable eval framework. The project still owns repeated trials, point mapping, thresholds, gates, evidence, reports, and CI behavior.

## Final recommendation

Use **Jev semantic grader** as the feature name.

Use **Jev, TypeSafe AI's System One model** at the first mention on each page.

Use **TypeSafe API** when the text discusses credentials, requests, SDKs, the console, or the hosted service.

This naming matches the official sources and remains clear for a beginner.
