# Realtime Preview API

`POST /api/preview` with JSON body.

Actions:
- `init` — `{ action:'init', sections: SectionNode[] }` → `{ sessionId, sections }`
- `preview` — `{ action:'preview', sessionId, command }` → `{ sections, intents, warnings, analysis }` (not committed)
- `command` — `{ action:'command', sessionId, command }` → same shape, committed to history
- `undo` — `{ action:'undo', sessionId }` → `{ sections }`
- `redo` — `{ action:'redo', sessionId }` → `{ sections }`
- `get` — `{ action:'get', sessionId }` → `{ sections }`
