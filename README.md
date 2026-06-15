# Keyboard Switcher Popup (`key-switcher-popup@dmitriy71n`)

Cinnamon extension that displays a modal popup with the current keyboard layout when it changes.

---

## Features and Support
* **Purpose:** Detects input source changes and shows a large semi-transparent OSD indicator (RU, EN, etc.) on the screen.
* **Cinnamon versions:** 6.0, 6.2, 6.4, 6.6.
* **Keybindings:** Supports any system shortcuts (`Alt+Shift`, `Ctrl+Shift`, `Caps Lock`, `Super+Space`, etc.).

---

## Manual Installation

Run this command in your terminal to automatically create the directory, download the 3 extension files (`extension.js`, `metadata.json`, `settings-schema.json`), and copy them into the system:

```bash
mkdir -p ~/.local/share/cinnamon/extensions/key-switcher-popup@dmitriy71n && \
git clone [https://github.com/dmitriy71n/key-switcher-popup.git](https://github.com/dmitriy71n/key-switcher-popup.git) /tmp/key-switcher-popup && \
cp /tmp/key-switcher-popup/extension.js /tmp/key-switcher-popup/metadata.json /tmp/key-switcher-popup/settings-schema.json ~/.local/share/cinnamon/extensions/key-switcher-popup@dmitriy71n/
```

**Activation:**
1. Restart Cinnamon: press `Alt + F2`, type `r`, press `Enter`.
2. Open **System Settings -> Extensions**, find **Keyboard Switcher Popup**, and click the **"+" (Add)** button.

---

## Settings

Manage configuration via: **System Settings -> Extensions -> Keyboard Switcher Popup** (gear icon).

* **Show on all monitors simultaneously** (`show_on_all_monitors`) — toggles indicator display (either only on the active monitor with the mouse cursor or on all screens at once).
* **Popup display timeout** (`timeout_ms`) — notification visibility duration (from 500 to 10000 ms, step 250 ms).
