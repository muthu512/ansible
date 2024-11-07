import { Helmet } from 'react-helmet-async';

import { TransactionView } from 'src/sections/transactions/view';

// ----------------------------------------------------------------------

export default function UserPage() {
    return (
        <>
            <Helmet>
                <title> Transactions | CRM </title>
            </Helmet>

            <TransactionView />
        </>
    );
}
