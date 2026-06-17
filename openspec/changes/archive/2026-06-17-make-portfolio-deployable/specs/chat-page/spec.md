# Capability: chat-page

## MODIFIED Requirements

### Requirement: Welcome message

On first open the assistant SHALL greet the visitor and explain what it is. The owner's name in the greeting MUST derive from `identity.name` sourced from `content/identity.json` — it MUST NOT be hardcoded.

#### Scenario: Welcome message appears on a fresh visit

GIVEN a visitor opens the chat page without a pre-filled question
WHEN the thread first renders
THEN the assistant's only message reads "Hey! I'm a chat layer over {identity.name}'s resume. Ask me about his experience, projects, skills, or how to get in touch."

#### Scenario: Welcome message updates when identity changes

GIVEN a site owner changes `name` in `content/identity.json`
WHEN the site is rebuilt
THEN the welcome message uses the new name with no component code change

---

### Requirement: Message thread display

Visitor and assistant turns SHALL be visually distinguishable. The assistant label MUST derive from `identity.firstName` sourced from `content/identity.json` — it MUST NOT be hardcoded.

#### Scenario: Visitor message styling

GIVEN the visitor has sent a message
WHEN it appears in the thread
THEN it is right-aligned with an accent-tinted background
AND it shows the label "you" with an avatar indicator

#### Scenario: Assistant message styling

GIVEN the assistant has replied
WHEN the reply appears in the thread
THEN it is left-aligned with a neutral background
AND it shows the label matching `identity.firstName` with an avatar indicator

#### Scenario: Assistant label updates when identity changes

GIVEN a site owner changes `firstName` in `content/identity.json`
WHEN the site is rebuilt
THEN the assistant message label shows the new first name with no component code change

---

### Requirement: Error fallback

A failed generation SHALL degrade to a helpful contact prompt. The owner's name in the error message MUST derive from `identity.name` — it MUST NOT be hardcoded.

#### Scenario: Assistant cannot process a question

GIVEN the visitor has sent a message
WHEN the assistant fails to generate a reply
THEN the assistant message reads "Sorry, I couldn't process that. Try rephrasing, or reach {identity.name} directly at [email]." with the real contact email substituted
