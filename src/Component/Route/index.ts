import { CSSProperties, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface RouteInterface {
    path: string;
    component?: any;
    componentPath: string;
    routes?: RouteInterface[];
    exact?: boolean;
    default?: boolean;
}

export interface RoutesInterface {
    route: RouteInterface[];
    NoMatch?: () => ReactElement | JSX.Element;
}

export type RouteProps = RouteComponentProps<any> & RoutesInterface;

export interface PathLinkParmas {
    componentPath: string;
    style?: CSSProperties;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    to: string;
    children: any;
}
