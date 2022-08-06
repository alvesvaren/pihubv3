import classNames from "classnames";
import * as React from "react";
import { useCallback } from "react";
import { OverlayData } from "../App";

const OVERLAY_TIMEOUT_MS = 1000 * 60 * 60; // 1 hour
export const OverlayContext = React.createContext<(data: OverlayData) => void>(() => {});

export default function WebOverlay(props: { data: OverlayData }) {
    const {
        data: { url, visible },
    } = props;
    const frameRef = React.useRef<HTMLIFrameElement>(null);
    const timeoutRef = React.useRef<number>();
    const setOverlay = React.useContext(OverlayContext);
    const timeoutWillCloseAt = React.useRef<number>();
    window.focus();

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutWillCloseAt.current = Date.now() + OVERLAY_TIMEOUT_MS;
        timeoutRef.current = window.setTimeout(() => {
            setOverlay({ url, visible: false });
        }, OVERLAY_TIMEOUT_MS);
    }, [setOverlay, url]);

    React.useEffect(() => {
        if (visible) resetTimeout();
        return () => {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
            timeoutWillCloseAt.current = undefined;
        };
    }, [visible, resetTimeout]);

    const timeLeft = timeoutWillCloseAt.current && Math.floor((timeoutWillCloseAt.current - Date.now()) / 1000);

    return (
        <div id='web-overlay' className={classNames({ visible })}>
            <nav className='button-bar'>
                <button onClick={() => frameRef.current?.contentWindow?.history.back()}>{"<"}</button>
                <button onClick={() => frameRef.current?.contentWindow?.history.forward()}>{">"}</button>
                <span>{url}</span>
                <button style={{}} onClick={() => setOverlay({ url, visible: false })}>
                    {!!(timeLeft && timeLeft < 100) && timeLeft + "s"} ⨯
                </button>
            </nav>
            <iframe ref={frameRef} title='Web overlay' src={url} />
        </div>
    );
}
