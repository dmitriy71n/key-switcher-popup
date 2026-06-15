const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Gdk = imports.gi.Gdk;
const Settings = imports.ui.settings;

let osds = [];
let signalSubscriptionId = null;
let settings = null;
let timeoutId = null;

// Объект, свойства которого Cinnamon будет автоматически обновлять при изменении в GUI
let settingsValues = {
    show_on_all_monitors: false,
    timeout_ms: 3000
};

function init(metadata) {}

function enable() {
    global.log('LayoutPopup: Активация.');

    // Безопасная инициализация и жесткая привязка настроек
    try {
        settings = new Settings.ExtensionSettings(settingsValues, 'key-switcher-popup@dmitriy71n');
        settings.bind('show_on_all_monitors', 'show_on_all_monitors', () => {});
        settings.bind('timeout_ms', 'timeout_ms', () => {});
        global.log('LayoutPopup: Связь с GUI настроек успешно установлена.');
    } catch (e) {
        global.logError('LayoutPopup: Критическая ошибка связи с настройками: ' + e.message);
    }

    // Подписка на D-Bus сигнал смены раскладки клавиатуры
    try {
        const sessionBus = Gio.bus_get_sync(Gio.BusType.SESSION, null);
        signalSubscriptionId = sessionBus.signal_subscribe(
            null,
            'org.Cinnamon',
            'CurrentInputSourceChanged',
            '/org/Cinnamon',
            null,
            Gio.DBusSignalFlags.NONE,
            _onCinnamonDbusSignal
        );
    } catch (e) {
        global.logError('LayoutPopup: Ошибка подписки на D-Bus: ' + e.message);
    }
}

function disable() {
    if (signalSubscriptionId) {
        try {
            const sessionBus = Gio.bus_get_sync(Gio.BusType.SESSION, null);
            sessionBus.signal_unsubscribe(signalSubscriptionId);
        } catch (e) {}
        signalSubscriptionId = null;
    }

    if (timeoutId) {
        GLib.source_remove(timeoutId);
        timeoutId = null;
    }
    destroyAllOSDs();

    if (settings) {
        settings.finalize();
        settings = null;
    }
}

function _onCinnamonDbusSignal(connection, sender_name, object_path, interface_name, signal_name, parameters) {
    try {
        if (parameters.n_children() > 0) {
            const rawVariant = parameters.get_child_value(0);
            const rawLangCode = rawVariant.get_string()[0];

            let lang = rawLangCode.toUpperCase();
            if (lang === 'US') lang = 'EN';

            if (timeoutId) {
                GLib.source_remove(timeoutId);
                timeoutId = null;
            }

            showLayoutPopup(lang);
        }
    } catch (e) {
        global.logError('LayoutPopup: Ошибка обработки сигнала: ' + e.message);
    }
}

function showLayoutPopup(text) {
    destroyAllOSDs();

    let targets = [];

    // Используем значения, которые автоматически прилетают из GUI настроек
    if (settingsValues.show_on_all_monitors) {
        const monitors = Main.layoutManager.monitors;
        if (monitors && monitors.length > 0) {
            for (let i = 0; i < monitors.length; i++) {
                targets.push(monitors[i]);
            }
        }
    } else {
        const currentMonitor = getMonitorAtMousePosition();
        if (currentMonitor) {
            targets.push(currentMonitor);
        }
    }

    if (targets.length === 0) return;

    let systemFont = 'sans-serif';
    try {
        const ifaceSettings = new Gio.Settings({ schema: 'org.cinnamon.desktop.interface' });
        const fontName = ifaceSettings.get_string('font-name');
        if (fontName) {
            const parts = fontName.trim().split(' ');
            if (parts.length > 1 && !isNaN(parseFloat(parts[parts.length - 1]))) {
                parts.pop();
            }
            systemFont = parts.join(' ') || 'sans-serif';
        }
    } catch (e) {}

    const popupStyle = `
        font-family: "${systemFont}";
        font-size: 32px;
        font-weight: bold;
        padding: 24px 32px;
        color: white;
        background-color: rgba(50, 50, 50, 0.75);
        border-radius: 12px;
        text-shadow: 0px 0px 7px #000;
    `;

    targets.forEach(monitor => {
        let osd = new St.Label({
            style: popupStyle,
            text: text,
            reactive: false,
        });

        Main.uiGroup.add_child(osd);
        osd.raise_top();
        osd.set_position(monitor.x + 32, monitor.y + 32);

        osd.opacity = 0;
        osd.ease({
            opacity: 255,
            duration: 150,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });

        osds.push(osd);
    });

    // Берем актуальный таймаут (в миллисекундах) прямо из GUI ползунка
    timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, settingsValues.timeout_ms, () => {
        hideAllOSDs();
        timeoutId = null;
        return GLib.SOURCE_REMOVE;
    });
}

function hideAllOSDs() {
    if (osds.length === 0) return;
    osds.forEach(osd => {
        if (osd && !osd.is_finalized()) {
            osd.ease({
                opacity: 0,
                duration: 250,
                mode: Clutter.AnimationMode.EASE_IN_QUAD,
                onComplete: () => {
                    if (osd && !osd.is_finalized()) osd.destroy();
                }
            });
        }
    });
    osds = [];
}

function destroyAllOSDs() {
    if (osds.length === 0) return;
    osds.forEach(osd => {
        if (osd && !osd.is_finalized()) osd.destroy();
    });
    osds = [];
}

function getMonitorAtMousePosition() {
    try {
        const display = Gdk.Display.get_default();
        if (display) {
            const seat = display.get_default_seat();
            if (seat) {
                const pointer = seat.get_pointer();
                if (pointer) {
                    const [screen, mouseX, mouseY] = pointer.get_position();
                    const gdkMonitor = display.get_monitor_at_point(mouseX, mouseY);
                    if (gdkMonitor) return gdkMonitor.get_geometry();
                }
            }
        }
    } catch (e) {}

    try {
        const [mouseX, mouseY] = global.get_pointer();
        const monitors = Main.layoutManager.monitors;
        for (let i = 0; i < monitors.length; i++) {
            const mon = monitors[i];
            if (mouseX >= mon.x && mouseX < mon.x + mon.width &&
                mouseY >= mon.y && mouseY < mon.y + mon.height) {
                return mon;
            }
        }
    } catch (e) {}
    return Main.layoutManager.primaryMonitor;
}
