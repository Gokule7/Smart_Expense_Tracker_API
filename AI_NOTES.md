# AI Notes - Smart Expense Tracker API

As permitted and encouraged by the assignment guidelines, I utilized AI assistance (Claude/Gemini) during the development of this project to expedite structural scaffolding and repetitive tasks. Below is the breakdown of how the tool was utilized, validated, and critiqued.

## 1. Code Attribution (AI-Generated vs. Human-Written)
*   **AI-Generated/Scaffolded**: 
    *   The structural layout of the project files (`storage.js`, `routes.js`, boilerplate setup in `app.js`).
    *   The initial OpenAPI/Swagger JSON definition structure.
    *   The baseline Jest test layout boilerplate for hitting the API endpoints.
*   **Human-Written/Modified**:
    *   The core calculation logic within the `/api/expenses/total` controller to ensure correct type coercion and prevent floating-point inaccuracies.
    *   The request body validation logic inside the POST endpoint to guarantee incoming types are handled safely.
    *   Refactoring the local JSON file handling code to ensure synchronous/atomic operations, preventing data race conditions during overlapping requests.

## 2. Validation, Testing, and Modifications
*   **Data Type Correction**: The initial AI scaffold treated the expense `amount` loosely. I modified the logic to enforce explicit parsing via `parseFloat()` and added validation to reject negative values or non-numeric inputs.
*   **Id Generation**: The AI suggested using an external numeric auto-increment system, which is error-prone for plain JSON files. I replaced it with native Node.js `crypto.randomUUID()` to generate robust, unique identifiers without pulling in third-party string packages.
*   **Error Boundaries**: I expanded the `DELETE` and `filter` endpoint logic to explicitly return 404 responses with clean JSON error messages instead of generic HTML error stack traces when resources are missing.

## 3. AI Suggestions Rejected
*   **Over-engineered Architecture**: The AI initially suggested a complex Hexagonal/Clean Architecture layout with separate repository layers, data-transfer-objects (DTOs), and service classes. I rejected this approach because a local JSON storage mechanism for a 4-hour apprentice task does not justify that level of abstraction. Keeping it to a simple routing/controller/storage pattern makes the code readable, maintainable, and appropriate for the scope.
*   **External Database Mocking Libraries**: The AI suggested utilizing specialized memory-database packages for testing. I opted out of this to keep the application dependencies lightweight, choosing instead to mock the native `fs` module operations directly inside Jest.