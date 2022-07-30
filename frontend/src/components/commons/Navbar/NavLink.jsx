import { NavLink as NavLinkReactRouter } from "react-router-dom";

export const NavLink = ({to, children, ...props}) => {
    return(
        <li>
        <NavLinkReactRouter
        {...props}
        className = {({isActive}) => isActive ? 'active': undefined}
        to = {to}
        >{children}
        </NavLinkReactRouter> 
        </li>
    )
}