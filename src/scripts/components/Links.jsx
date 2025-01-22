import { __ } from "@wordpress/i18n";
import {useState} from "react";
import {navigate} from "@modycloud/tools/navigate";

const Links = ({ routes, locationPathname = '/invoices/' }) => {
    if (!routes || Object.keys(routes).length === 0) {
        return '';
    }

    const [currentPath, setCurrentPath] = useState(locationPathname);

    const routesEntries = Object.entries(routes).map(([key, value]) => ({
        link: key.endsWith('/') ? key : `${key}/`,
        title: value
    }));

    return (
        <>
            {routesEntries.map(({ link, title }) => {
                return <a
                    href={link}
                    key={link}
                    onClick={(event) => {
                        const link = event.currentTarget.getAttribute('href');
                        setCurrentPath(link);
                        navigate(event);
                    }}
                    className={`link${currentPath === link ? ' active' : ''}`}
                >
                    {__(title)}
                </a>
            })}
        </>
    );
};

export default Links;
