import classNames from "classnames";
import * as React from "react";
import { OverlayData } from "../App";

export const OverlayContext = React.createContext<(data: OverlayData) => void>(() => {});

export default function WebOverlay(props: { data: OverlayData }) {
    const {
        data: { url, visible },
    } = props;
    const frameRef = React.useRef<HTMLIFrameElement>(null);
    const setOverlay = React.useContext(OverlayContext);

    return (
        <div id='web-overlay' className={classNames({ visible })}>
            <nav className='button-bar'>
                <button onClick={() => frameRef.current?.contentWindow?.history.back()}>{"<"}</button>
                <button onClick={() => frameRef.current?.contentWindow?.history.forward()}>{">"}</button>
                <span>{url}</span>
                <button onClick={() => setOverlay({ url, visible: false })}>⨯</button>
            </nav>
            <iframe ref={frameRef} title='Web overlay' src={url} />
        </div>
    );
}
