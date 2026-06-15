# Keyboard Switcher Popup (`key-switcher-popup@dmitriy71n`)

Cinnamon extension that displays a modal popup with the current keyboard layout when it changes.

---

## Features and Support
* **Purpose:** Detects input source changes and shows a large semi-transparent OSD indicator (RU, EN, etc.) on the screen.
* **Cinnamon versions:** 6.0, 6.2, 6.4, 6.6.
* **Keybindings:** Supports any system shortcuts (`Alt+Shift`, `Ctrl+Shift`, `Caps Lock`, `Super+Space`, etc.).

---

## Manual Installation

Run these terminal commands one by one:

1. Create the extension directory:
```bash
mkdir -p ~/.local/share/cinnamon/extensions/key-switcher-popup@dmitriy71n
```
2. Download the archive:
```bash
wget https://github.com/dmitriy71n/key-switcher-popup/archive/refs/heads/main.zip
```
3. Extract the archive into your home folder:
```bash
unzip key-switcher-popup-main.zip -d ~
```
4. Change to the extracted directory:
```bash
unzip main.zip
```
5. Copy the files into the system:
```bash
cp extension.js metadata.json settings-schema.json ~/.local/share/cinnamon/extensions/key-switcher-popup@dmitriy71n/
```

**Activation:**
1. Restart Cinnamon: press `Alt + F2`, type `r`, press `Enter`.
2. Open **System Settings -> Extensions**, find **Keyboard Switcher Popup**, and click the **"+" (Add)** button.

---

## Settings

Manage configuration via: **System Settings -> Extensions -> Keyboard Switcher Popup** (gear icon).

* **Show on all monitors simultaneously** (`show_on_all_monitors`) — toggles indicator display (either only on the active monitor with the mouse cursor or on all screens at once).
* **Popup display timeout** (`timeout_ms`) — notification visibility duration (from 500 to 10000 ms, step 250 ms).
