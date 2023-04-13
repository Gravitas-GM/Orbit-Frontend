import { H2 } from "@blueprintjs/core";
import { useEffect } from "react";
import "./PageHeader.scss"

interface IProps {
	title: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<IProps> = ({ title, children }) => {
	useTitle(`Happy Orbit - ${title}`);

	return (
        <header className="header-container">
            <H2>{title}</H2>

            {children}
        </header>
    );
};

export function useTitle(title: string) {
	useEffect(() => {
		document.title = title;
	}, []);
}
