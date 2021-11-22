# Pihub v3

Webbsida att visa på en raspberry pi touch screen som använder sig av home assistant för att hämta data och visa upp på skärmen.

![Screenshot](screenshot.png)

## Installera:

- Klona repon med `git clone https://github.com/alvesvaren/pihubv3.git`
- Installera dependencies med `yarn install` i repo-mappen

## Konfigurera:

- Kopiera `src/config-example.json` till `src/config.json` och ändra värdena i filen.

## Bygga:

- Bygg projektfilerna för att det ska starta snabbare med `yarn build`

## Använda:

- Länka tjänstfilen med: `sudo systemctl link $PWD/pihub.service`
- Starta samt sätt på autostart för tjänsten med: `sudo systemctl enable --now pihub.service`
