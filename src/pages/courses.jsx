import { Helmet } from 'react-helmet-async';

import { CoursesView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function CoursesPage() {
    return (
        <>
            <Helmet>
                <title> Master | Courses </title>
            </Helmet>

            <CoursesView />
        </>
    );
}