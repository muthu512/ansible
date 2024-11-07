import { Helmet } from 'react-helmet-async';

import { CustomerInfo } from 'src/sections/crm/view';
// ----------------------------------------------------------------------

export default function CustomerPage() {
    return (
        <>
            <Helmet>
                <title> CRM | Customer </title>
            </Helmet>

            <CustomerInfo/>
        </>
    );
}