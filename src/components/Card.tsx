import classNames from "classnames";

export default function Card(props: { children?: React.ReactNode; className?: string }) {
    return <div className={classNames("card", props.className)}>{props.children}</div>;
}
