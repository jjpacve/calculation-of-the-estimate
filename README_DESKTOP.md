# Десктоп-приложение: Windows и macOS

Веб-калькулятор в корне репозитория продолжает работать на GitHub Pages.
Отдельное приложение собирается с помощью **Tauri 2**.

## Как это работает

- `index.html` — тот же интерфейс HTML + CSS.
- `Расчет.js` — обработчик кнопки. В браузере использует JavaScript;
  в приложении вызывает команду Tauri `calculate_soch`.
- `src-tauri/src/lib.rs` — небольшой мост Rust между JavaScript и C++.
- **`src-tauri/cpp/calculator.cpp` — расчёт на C++. Менять формулу можно здесь.**
- `src-tauri/build.rs` компилирует C++ и связывает его с приложением.

## Скачать готовые сборки

Открой **Actions → Desktop (Windows and macOS)**, выбери успешный запуск
и в разделе **Artifacts** скачай архив:

- `installer-windows` — установщик **.exe**.
- `installer-macos-apple-silicon` — образ **.dmg** для Mac с M1/M2/M3/M4 и новее.

Архив нужно распаковать. Сборки не подписаны платным сертификатом:
Windows SmartScreen или macOS Gatekeeper могут показать предупреждение.
На Mac приложение может потребовать разрешения на запуск.

## Запуск на своём компьютере

Нужны Node.js, Rust, C++ toolchain и системные зависимости Tauri.
См. https://v2.tauri.app/start/prerequisites/

```sh
npm install
npm run tauri -- icon app-icon.svg
npm run desktop:dev
```

Для сборки на компьютере:

```sh
npm run desktop:build
```

## Важно

Для изменения формулы редактируй `src-tauri/cpp/calculator.cpp`.
Публикация веб-версии и десктоп-сборки независимы.
