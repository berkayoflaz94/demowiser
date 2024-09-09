"use client";

import withAuth from '@/utils/withAuth';

function Page() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    window.location.href = "/";
    return null;
}

export default withAuth(Page)
