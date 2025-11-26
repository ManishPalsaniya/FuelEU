# AI Agent Reflection

## What I Learned Using AI Agents
Working with the Antigravity Agent highlighted the power of **context-aware coding**. The agent didn't just "write code"; it understood the relationships between the frontend (Next.js) and the backend (Hexagonal Architecture). For instance, when debugging the "Compliance record not found" error, the agent correctly inferred that the issue wasn't just a syntax error but a logical mismatch between the hardcoded year in the frontend actions and the available data in the backend. This ability to traverse the stack—from UI components to backend controllers—is a significant shift from traditional snippet-based coding assistance.

## Efficiency Gains vs. Manual Coding
- **Speed:** The most obvious gain was speed. Tasks like "apply this color theme to 4 different files" were completed in seconds. Manually finding every class name and updating hex codes would have been tedious and error-prone.
- **Debugging:** The agent acted as a force multiplier for debugging. Instead of manually adding `console.log` everywhere, I could ask the agent to "trace the data flow," and it would identify that `getBankingRecords` was defaulting to the wrong year. This reduced debugging time from potentially hours to minutes.
- **Boilerplate:** Generating documentation (like this file and the README) and standard UI components was near-instant, allowing me to focus on the business logic (pooling rules, compliance formulas).

## Improvements for Next Time
- **Proactive Data Validation:** The "year mismatch" bug could have been caught earlier if the agent had proactively checked the data schema or available records before implementing the feature. In the future, I would ask the agent to "verify data availability" as a first step in any feature implementation.
- **Atomic Tool Usage:** There was an instance where the agent tried to do too much in one tool call (complex multi-chunk replacement) and failed. Breaking down complex refactors into smaller, atomic steps (e.g., one file at a time) would be more robust and less prone to tool errors.
- **Visual Verification:** While the agent is great at code, it can't "see" the UI. I learned to be very specific with visual instructions (e.g., "medium blue," "horizontal label," "top position") to get the desired result faster. Providing a screenshot or a mock-up initially (if possible) would streamline UI iteration.
