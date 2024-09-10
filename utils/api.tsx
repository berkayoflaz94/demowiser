"use server";

const apiUrl = "http://18.193.121.63:8080/api"
// const apiUrl = "http://192.168.1.102:8080/api"

export async function apiLogin(user:any){
    try {
        const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify(user),
        });

        if (!res.ok) {
            throw new Error('Giriş bilgileri hatalı veya sunucuya ulaşılamıyor.');
        }

        return await res.json();
    } catch (error) {
        console.error('API Login Hatası:', error);
        return null;
    }
}

export async function getTitles(){
    const res = await fetch(`${apiUrl}/titles`, {
        cache: "no-store",
    });
    return await res.json();
}

export async function apiPostSaveTitle(title: any){
    const res = await fetch(`${apiUrl}/titles`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}

export async function apiPostUpdateTitle(title: any){
    const res = await fetch(`${apiUrl}/titles/${title._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}

export async function apiPostDeleteTitle(title: any){
    const res = await fetch(`${apiUrl}/titles/${title._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}



// Companies

export async function getApiCompanies(){
    const res = await fetch(`${apiUrl}/companies`, {
        cache: "no-store",
    });
    return await res.json();
}

export async function apiPostSaveCompanies(title: any){
    const res = await fetch(`${apiUrl}/companies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}

export async function apiPostUpdateCompanies(title: any){
    const res = await fetch(`${apiUrl}/companies/${title._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}

export async function apiPostDeleteCompanies(title: any){
    const res = await fetch(`${apiUrl}/companies/${title._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}

export async function apiGetCompanyMembers(title: any){
    const res = await fetch(`${apiUrl}/people/company/${title}`, {
        cache: "no-store",
    });
    return await res.json();
}



// Perosns

export async function getApiPersons(){
    const res = await fetch(`${apiUrl}/people`, {
        cache: "no-store",
    });
    return await res.json();
}

export async function apiPostSavePersons(title: any){
    const res = await fetch(`${apiUrl}/people`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    console.log(title)
    return await res.json()
}

export async function apiPostUpdatePersons(title: any){
    const res = await fetch(`${apiUrl}/people/${title._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}

export async function apiPostDeletePersons(title: any){
    const res = await fetch(`${apiUrl}/people/${title._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}


// Recommendations


export async function fetchRecommendations(
    selectedTitle: string,
    selectedCompany: string,
    selectedPerson: string,
    selectedLang: string
) {
    try {
        // Statik JSON verisi
        const res = await fetch(`${apiUrl}/posts/recommendation?titleId=${selectedTitle}&companyId=${selectedCompany}&personId=${selectedPerson}&lang=${selectedLang}`, {
            cache: "no-store",
        });

        const data = await res.json();

        // İlk 5 veriyi recommendations, sonraki 5 veriyi backup olarak ayır
        const recommendations = data.slice(0, 5);
        const backupRecommendations = data.slice(5, 10);

        return {
            main: recommendations,
            backup: backupRecommendations,
        };
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return {
            main: [],
            backup: [],
        };
    }
}

export async function apiSearchRecommendations(
    url: string
){

    console.log("res")
    try {
        const res = await fetch(`${apiUrl}/posts/search${url}`);

        return await res.json();
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return null;
    }
}

export async function apiGeCurations(){
    const res = await fetch(`${apiUrl}/curations`, {
        cache: "no-store",
    });
    return await res.json();
}

export async function apiPostSaveCurations(title: any){
    const res = await fetch(`${apiUrl}/curations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });

    return await res.json();
}

export async function sendMail(data: any, count: number){
    const res = await fetch(`${apiUrl}/posts/sendmail?count=${count}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            cache: "no-store",
        },
        body: JSON.stringify(data),
    });

    return await res.json();
}

export async function apiPostDeleteCuratons(title: any){
    const res = await fetch(`${apiUrl}/curations/${title._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(title),
    });
    return await res.json();
}
