# Apple Music CLI

Control Apple Music from the terminal using AppleScript (macOS only).

## Install

```bash
bun install
```

## Usage

```bash
# Using alias (add to fish config)
alias am "bun run /path/to/src/index.ts"

# Playback
am play          # Start playback
am pause         # Pause
am toggle        # Toggle play/pause
am next          # Next track
am prev          # Previous track

# Now playing
am now           # Show current track info

# Volume
am vol           # Get volume
am vol 50        # Set volume to 50%

# Playlists
am playlists                    # List all playlists
am playlist "My Playlist"       # Play a playlist
am tracks "My Playlist"         # List tracks in playlist

# Library
am songs                        # List all songs
am search nirvana               # Search library
am song "Come As You Are"       # Play a song by name

# Options
am shuffle on                   # Enable shuffle
am repeat all                   # Set repeat mode (off/one/all)

# Pagination (works with playlists, tracks, songs, search)
am songs --limit 20 --offset 40
am search rock --limit 10
```

## Architecture

```
src/
├── index.ts              # CLI entry point - parses command and dispatches
├── osascript.ts          # AppleScript execution helpers
├── args.ts               # Command-line argument parsing utilities
├── pagination.ts         # Pagination utilities for list commands
└── commands/
    ├── index.ts          # Command registry - maps names to handlers
    ├── playback.ts       # play, pause, stop, next, prev, toggle
    ├── now.ts            # Current track info display
    ├── volume.ts         # Volume get/set
    ├── playlists.ts      # Playlist listing and playback
    ├── library.ts        # Library browsing and search
    ├── options.ts        # Shuffle and repeat settings
    └── help.ts           # Help text display
```

### Module Overview

| Module | Description |
|--------|-------------|
| `osascript` | Low-level AppleScript execution via `osascript` command |
| `args` | Parses `--flag value` and positional arguments |
| `pagination` | Generic pagination with limit/offset support |
| `commands/*` | Individual command implementations |

### Adding a New Command

1. Create a new file in `src/commands/` (or add to existing file)
2. Export an async function matching the `Command` type signature
3. Register it in `src/commands/index.ts`
4. Update help text in `src/commands/help.ts`

Example:

```typescript
// src/commands/mycommand.ts
import { osascript } from "../osascript";

export async function myCommand(): Promise<void> {
  const result = await osascript('tell application "Music" to ...');
  console.log(result);
}

// src/commands/index.ts
import { myCommand } from "./mycommand";

export const commands: Record<string, Command> = {
  // ...
  mycommand: () => myCommand(),
};
```

## Limitations

- **Local library only**: Search and listing only work with downloaded/local tracks, not streaming catalog
- **No radio/recommendations**: AppleScript can't access Apple Music radio stations or personalized recommendations
- **macOS only**: Uses AppleScript under the hood

## TODO

- [ ] MusicKit integration for accessing Apple Music streaming features (radio, recommendations, full catalog search)
  - Requires Apple Developer account and signing keys
  - Would enable: Discovery Station, personal mixes, radio stations
  - Reference: https://developer.apple.com/musickit/
