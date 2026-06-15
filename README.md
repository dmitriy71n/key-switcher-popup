# Keyboard Switcher Popup (`key-switcher-popup@dmitriy71n`)

Расширение Cinnamon, отображающее модальное окно с текущей раскладкой клавиатуры при её изменении.

---

## Функции и поддержка
* **Назначение:** Отслеживает смену языка ввода и выводит крупный полупрозрачный индикатор (RU, EN и др.).
* **Версии Cinnamon:** 6.0, 6.2, 6.4, 6.6.
* **Сочетания клавиш:** Поддерживает любые системные комбинации (`Alt+Shift`, `Ctrl+Shift`, `Caps Lock`, `Super+Space` и т.д.).

---

## Ручная установка

Выполните команду в терминале для автоматического создания директории, загрузки 3 файлов расширения (`extension.js`, `metadata.json`, `settings-schema.json`) и копирования их в систему:

```bash
mkdir -p ~/.local/share/cinnamon/extensions/key-switcher-popup@dmitriy71n && \
git clone [https://github.com/dmitriy71n/key-switcher-popup.git](https://github.com/dmitriy71n/key-switcher-popup.git) /tmp/key-switcher-popup && \
cp /tmp/key-switcher-popup/extension.js /tmp/key-switcher-popup/metadata.json /tmp/key-switcher-popup/settings-schema.json ~/.local/share/cinnamon/extensions/key-switcher-popup@dmitriy71n/
```

**Активация:**
1. Перезапустите Cinnamon: нажмите `Alt + F2`, введите `r`, нажмите `Enter`.
2. Откройте **Параметры системы -> Расширения**, найдите **Keyboard Switcher Popup** и нажмите кнопку **«+» (Добавить)**.

---

## Настройки

Управление параметрами осуществляется через меню: **Параметры системы -> Расширения -> Keyboard Switcher Popup** (иконка шестерёнки).

* **Отображать на одном или нескольких мониторах одновременно** (`show_on_all_monitors`) — переключатель вывода индикатора (только на активном мониторе с курсором мыши или на всех экранах сразу).
* **Задержка модального окна на экране** (`timeout_ms`) — время отображения уведомления (от 500 до 10000 мс, шаг 250 мс).
