import classNames from "classnames";

export default function Card(props: { children?: React.ReactNode; className?: string; onClick?: React.MouseEventHandler<HTMLDivElement> }) {
    return (
        <div onClick={props.onClick} className={classNames("card", props.className)}>
            {props.children}
        </div>
    );
}
