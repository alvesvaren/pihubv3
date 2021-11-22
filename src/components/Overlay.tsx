import * as React from "react";

export const OverlayContext = React.createContext<(url: string) => void>(() => {});

export default function WebOverlay(props: { url: string }) {
    const { url } = props;
    const frameRef = React.useRef<HTMLIFrameElement>(null);
    const setOverlay = React.useContext(OverlayContext);

    return url ? (
        <div id="web-overlay">
            <nav className="button-bar">
                <button onClick={() => frameRef.current?.contentWindow?.history.back()}>{"<"}</button>
                <button onClick={() => frameRef.current?.contentWindow?.history.forward()}>{">"}</button>
                <span>{url}</span>
                <button onClick={() => setOverlay("")}>⨯</button>
            </nav>
            <iframe ref={frameRef} title="Web overlay" src={url} />
        </div>
    ) : (
        <></>
    );
}
