import { useHassDevice } from "homeassistant-react-hooks";
import React from "react";


// const LevelIcon = () => (
//     <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='1em' height='1em' fill='currentColor'>
//         <path d='m24 43.2-9.8-9.75L17.65 30l4 4.05v-20.1l-4 4.05-3.45-3.45L24 4.8l9.8 9.75L30.35 18l-4-4.05v20.1l4-4.05 3.45 3.45Z' />
//     </svg>
// );

const SackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="mdi-sack" width="1em" height="1em" viewBox="0 0 24 24" fill='currentColor'><path d="M16,9C20,11 21,18 21,18C21,18 22,22 16,22C10,22 8,22 8,22C2,22 3,18 3,18C3,18 4,11 8,9M14,4L12,2L10,4L6,2L8,7H16L18,2L14,4Z" /></svg>
)

const TempIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='1em' height='1em' fill='currentColor'>
        <path d='M24 45.25q-4.7 0-7.97-3.27-3.28-3.28-3.28-7.98 0-2.65 1.13-5.05t3.42-3.65V9.45q0-2.8 1.93-4.78Q21.15 2.7 24 2.7q2.8 0 4.78 1.98 1.97 1.97 1.97 4.77V25.3q2.25 1.25 3.4 3.65T35.3 34q0 4.7-3.3 7.97-3.3 3.28-8 3.28Zm-2-22.9h4V19.8h-2v-2.35h2V13.5h-2v-2.35h2v-1.7q0-.85-.57-1.42-.58-.58-1.43-.58t-1.43.57Q22 8.6 22 9.46Z' />
    </svg>
);

const BoilerStatus: React.FC = () => {
    const temp = Math.floor(+(useHassDevice("sensor.vattentemperatur_2")?.state ?? NaN));
    const pelletPercent = Math.floor(+(useHassDevice("sensor.boiler_v2_pelletss_ckar")?.state ?? NaN));

    return (
        <div className='boiler-status'>
            Panna:
            <span>
                <TempIcon />
                {isNaN(temp) || !temp ? "?" : temp}°C
            </span>
            <span>
                <SackIcon />
                {isNaN(pelletPercent) || !(pelletPercent >= 0) ? "?" : pelletPercent} st
            </span>
        </div>
    );
};

export default BoilerStatus;
