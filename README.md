# Pihub v3

Website to show on a raspberry pi touch screen that uses home assistant to get data and show it on the screen.

![Screenshot](screenshot.png)

## Install:

- Clone the repo with `git clone https://github.com/alvesvaren/pihubv3.git`
- Download dependencies with `yarn install` inside the repo folder

### Configure:

- Copy `src/config-example.json` to `src/config.json` and change the values for your needs

### Build:

- Build the project with `yarn build`

### Start:

- Link the service file: `sudo systemctl link $PWD/pihub.service`
- Start and enable autostart: `sudo systemctl enable --now pihub.service`
