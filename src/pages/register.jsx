import { Helmet } from 'react-helmet-async';

import { RegisterViwe } from 'src/sections/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
    return (
        <>
            <Helmet>
                <title> Register | CRM </title>
            </Helmet>

            <RegisterViwe />
        </>
    );
}
