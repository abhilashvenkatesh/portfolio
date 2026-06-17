# Capability: model-preloader

## Purpose

Layout-level engine initialisation and Service Worker cache warming for the WebLLM model. The `ModelProvider` starts loading the model the moment any page in the app is visited; a Service Worker pre-fetches model weights at browser idle time so repeat-visit chat loads only GPU init (~5–10 s) instead of the full 2.1 GB download.

## Requirements

### Requirement: Layout-level model preload

The WebLLM engine SHALL begin initialising as soon as any page in the app renders, not only when the visitor navigates to `/chat`. A `ModelProvider` client wrapper at layout level owns the engine instance, loading state, and progress signal. A separate `ChatProvider` (chat-page only) owns message history and send logic.

#### Scenario: Engine starts loading on homepage visit

GIVEN a visitor opens the home page
WHEN the page renders
THEN the WebLLM engine begins loading in the background
AND no visible loading indicator is shown on the home page
AND the `model state` is `loading`

#### Scenario: Chat page inherits already-loading engine

GIVEN the engine has been loading since the visitor arrived on the home page
WHEN the visitor navigates to `/chat`
THEN the chat page receives the in-progress engine from `ModelProvider`
AND the chat loading indicator reflects the current progress (not restarted from 0%)
AND no second download or initialisation begins

#### Scenario: Engine state persists across client navigations

GIVEN the engine has reached `ready` while the visitor was browsing any page
WHEN the visitor navigates to `/chat`
THEN the chat page is immediately interactive without any loading screen

#### Scenario: Provider split — ModelProvider vs ChatProvider

GIVEN the layout mounts `ModelProvider`
WHEN the chat page mounts
THEN `ChatProvider` (chat-page only) consumes `ModelProvider` context for engine access
AND `ChatProvider` owns messages, input state, and the send function
AND `ModelProvider` does NOT own any chat-specific state

### Requirement: Service Worker cache warming

A Service Worker installed on the home page SHALL fetch and cache model weight files at browser idle time so that a second visit to `/chat` skips the 2.1 GB download entirely.

#### Scenario: SW registered on first home page visit

GIVEN a visitor opens the home page in a browser that supports Service Workers
WHEN the page becomes idle (requestIdleCallback fires)
THEN the Service Worker is registered at `/sw.js`
AND it begins fetching model weight URLs from the MLC CDN into the Cache API

#### Scenario: Second visit skips weight download

GIVEN a visitor previously completed a home page visit where SW cache warming ran
WHEN the visitor returns to the site and navigates to `/chat`
THEN the WebLLM engine resolves weight files from the SW Cache API
AND the model loads with only GPU initialisation remaining (~5–10 s)
AND no re-download occurs for already-cached weight files

#### Scenario: Cache warming does not block page interaction

GIVEN the SW is registered and beginning to fetch model weights
WHEN the visitor interacts with the home page (clicks chips, types in launcher)
THEN page interaction is unaffected
AND cache warming yields to user-initiated network requests

#### Scenario: No SW support degrades gracefully

GIVEN a visitor's browser does not support Service Workers
WHEN the home page loads
THEN no SW registration is attempted
AND the chat page loads normally using the standard Cache API path built into WebLLM
