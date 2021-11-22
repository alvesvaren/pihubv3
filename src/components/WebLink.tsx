import * as React from "react";
import { OverlayContext } from "./Overlay";

export default function WebLink(props: { href: string; children: React.ReactNode; className?: string }) {
    const setOverlay = React.useContext(OverlayContext);

    return (
        <span className={props.className} onClick={() => setOverlay(props.href)}>
            {props.children}
        </span>
    );
}
