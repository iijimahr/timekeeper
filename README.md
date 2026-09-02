**This repository is a fork of [maruta/timekeeper](https://github.com/maruta/timekeeper).**

# Time Keeper
HTML5 and JavaScript based timer with notification chime for academic conference.

### How to Use?
Access
https://iijimahr.github.io/timekeeper
or you can use local copy of this repository.

Time Keeper keeps the screen awake while the timer is running
(via the Screen Wake Lock API). On browsers without that API, be careful to
turn off screen savers and automatic screen cut yourself.

### Offline Use (Install as an App)

Time Keeper is a PWA and works with no network connection once it has been
loaded on the device.

**iOS / iPadOS**

 1. Open https://iijimahr.github.io/timekeeper in Safari and wait a moment for
    the assets to be cached.
 2. Share :arrow_up: → **Add to Home Screen**.
 3. Launch it from the home screen icon. It works in airplane mode.

**Android / Desktop Chrome**

Use the install button in the address bar, or just visit the page once — the
service worker caches everything either way.

**:bangbang: On iPhone/iPad, the chime is silenced by the ring/silent switch.
Turn silent mode off before your session. :bangbang:**

Note that the app always starts with the default times. To use custom settings,
open your bookmarked URL (see below) rather than the home screen icon.

### How to Save the Settings?
All current settings are included in URL.
Just use bookmark to preserve your settings.

When you are using Chrome and running local copy of Time Keeper,
Chrome does not permit to update the URL due to a security reason.
Time Keeper logo on left-top is the link to the URL with the current setting, and can be used to get the URL.

### Need a countdown timer?

[Set negative initial and bell times.](http://maruta.github.io/timekeeper/#t0=-15:00&t1=-10:00&t2=-5:00&t3=0:00&m=Click%20to%20edit%20this%20message.
)

### How to Customize Appearance?

 * Edit timekeeper/theme/default.css
 * By using class added to the body tag, the appearance can be changed according to the phase and state of the timer.
 * Theme can be specified via URL as  
   http://maruta.github.io/timekeeper/#th=example  
   In this case, timekeeper/theme/example.css will be loaded in place of default.css.

### Use with OBS Studio via browser source

 * When Time Keeper is imported into OBS Studio via a browser source, it is possible to link scene switching with timer operation.
 * When you switch to a scene that contains the magic keywords `:standby`, `:start`, and `:pause` in the scene name, the corresponding button will be pressed.

https://user-images.githubusercontent.com/486675/118618497-a43d7780-b7fe-11eb-8662-587abeeae9ab.mp4

### Maintenance Note

Offline support is provided by `sw.js`, which precaches every asset listed in
its `PRECACHE_URLS`. **When you add, remove, or modify any of those assets, bump
`CACHE_NAME` in `sw.js`** — otherwise installed clients keep serving the old
copies indefinitely. Updates take effect the next time the app is launched, not
mid-session, so a running timer is never reloaded out from under you.

### License
Timekeeper is open-sourced software licensed under The MIT License.

This repository contains codes from

 * [jQuery](https://jquery.org/license/) licensed under MIT License
 * [jQuery Timer plugin](http://www.mattptr.net/) licensed under BSD License
 * [Bootstrap](https://github.com/twbs/bootstrap/blob/master/LICENSE) licensed under MIT License
 * [DOMPurify](https://github.com/cure53/DOMPurify) licensed under Apache-2.0 License

and

 * A modified version of [Roboto](https://fonts.google.com/specimen/Roboto/about) font
    * In this version, the "colon" is replaced with a "fancy colon" to be displayed in the proper position in the time display. Roboto is licensed under the Apache-2.0 License. Our modifications don't in any way alter the existing license of the font. 
