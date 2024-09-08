"use client";
import React, { useEffect, useState } from 'react';
import SearchableSelect from '@/components/Select/SearchableSelect';
import { apiGetCompanyMembers, apiSearchRecommendations, getApiCompanies, getTitles } from '@/utils/api';
import { showMessage } from '@/utils/message';
import Loading from '@/components/layouts/loading';

const MailPlanner = () => {
    const defaultParams = {
        _id: null,
        company: '',
        user: '',
        title: '',
        mailType: '',
        cronJob: '',
        cronTime: '',
        keywords: [] as string[],
    };

    const [companyList, setCompanyList] = useState([]);
    const [titles, setTitles] = useState([]);
    const [peoples, setPeoples] = useState<any>([]);
    const [selectedRecommendations, setSelectedRecommendations] = useState<any>();
    const [searchInput, setSearchInput] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedPeople, setSelectedPeople] = useState('');
    const [selectedLang, setSelectLang] = useState('');
    const [backupRecommendations, setBackupRecommendations] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    // Fetch initial data for companies and titles
    useEffect(() => {
        getApiCompanies().then((data) => setCompanyList(data));
        getTitles().then((data) => setTitles(data));
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            setSelectedPeople(''); // Şirket değiştiğinde "People" seçimini temizle
            apiGetCompanyMembers(selectedCompany)
                .then((data) => {
                    if (Array.isArray(data)) {
                        setPeoples(data);
                    } else {
                        setPeoples([]);
                        showMessage('Unexpected data format for people list.', 'error');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching company members:', error);
                });
        } else {
            setPeoples([]); // Şirket seçilmediğinde "People" listesini temizle
            setSelectedPeople('');
        }
    }, [selectedCompany]);

    const handleSearchRecommend = (selectedRecommendations: any, searchInput: string) => {
        setLoading(true)

        if (selectedRecommendations === "1"){
            apiSearchRecommendations(`?lang=${selectedLang}&titleId=` + selectedTitle).then((data) => {
                if (data && Array.isArray(data)) {
                    setBackupRecommendations(data);
                } else {
                    showMessage('Failed to fetch valid recommendations.', 'error');
                }
            }).catch((error) => {
                console.error('Error in handleSearchRecommend:', error);
                showMessage('An error occurred while fetching recommendations.', 'error');
            }).finally(() => setLoading(false));
        }else if (selectedRecommendations === "2"){
            apiSearchRecommendations("?lang=" + selectedLang + "&personId=" + selectedPeople).then((data) => {
                if (data && Array.isArray(data)) {
                    setBackupRecommendations(data);
                } else {
                    showMessage('Failed to fetch valid recommendations.', 'error');
                }
            }).catch((error) => {
                console.error('Error in handleSearchRecommend:', error);
                showMessage('An error occurred while fetching recommendations.', 'error');
            }).finally(() => setLoading(false));
        }else if (selectedRecommendations === "3"){
            apiSearchRecommendations("?lang=" + selectedLang + "&searchText=" + searchInput).then((data) => {
                if (data && Array.isArray(data)) {
                    setBackupRecommendations(data);
                } else {
                    showMessage('Failed to fetch valid recommendations.', 'error');
                }
            }).catch((error) => {
                console.error('Error in handleSearchRecommend:', error);
                showMessage('An error occurred while fetching recommendations.', 'error');
            }).finally(() => setLoading(false));
        }
    };

    return (
        <div className="panel">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Posts Pool</h5>
            </div>
            <div className={'flex flex-row mb-7 gap-4'}>
                <div className={"w-full"}>
                    <SearchableSelect
                        list={companyList}
                        selectedItem={selectedCompany}
                        placeholder={"Select Company"}
                        setSelectedItem={setSelectedCompany}
                    />
                </div>
                <div className={"w-full"}>
                    <SearchableSelect
                        list={titles}
                        selectedItem={selectedTitle}
                        placeholder={"Select Title"}
                        setSelectedItem={setSelectedTitle}
                    />
                </div>
                <div className={"w-full"}>
                    <SearchableSelect
                        list={peoples}
                        selectedItem={selectedPeople}
                        placeholder={"Select People"}
                        setSelectedItem={setSelectedPeople}
                    />
                </div>
                <div className="w-full">
                    <SearchableSelect list={[
                        {
                            _id: "1",
                            name: "Search by Title",
                        },
                        {
                            _id: "2",
                            name: "Search by User",
                        },
                        {
                            _id: "3",
                            name: "Search by Keyword",
                        }
                    ]} selectedItem={selectedRecommendations} placeholder={"Search Recommendations"}
                                      setSelectedItem={(value) => setSelectedRecommendations(value)} />
                </div>
                {
                    selectedRecommendations == "3" && (
                        <div className={'w-full'}>
                            <input type="text" placeholder="Search..." className="form-input"
                                   onChange={(e) => setSearchInput(e.target.value)} />
                        </div>
                    )
                }
                <div className={"w-full"}>
                    <SearchableSelect
                        list={[{ _id: "en", name: "English" }, { _id: "tr", name: "Turkish" }]}
                        selectedItem={selectedLang}
                        placeholder={"Select Language"}
                        setSelectedItem={setSelectLang}
                    />
                </div>
                <div className={'w-fit'}>
                    <button type="button"
                            onClick={() => handleSearchRecommend(selectedRecommendations, searchInput)}
                            className={'btn btn-primary'}>Search
                    </button>
                </div>
            </div>

            {loading && <Loading type={true} />}

            <div className={"flex flex-col gap-5"}>
                {
                    backupRecommendations && backupRecommendations.length > 0 && backupRecommendations.map((item: any) => (
                        <a href={item.url} target={"_blank"} key={item._id}
                            className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 relative ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                            <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                <img alt="avatar" src={item.image} className="mx-auto h-11 w-11 rounded-full" />
                            </div>
                            <div
                                className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                <div className="my-3 font-semibold md:my-0">
                                    <div className="text-base text-dark dark:text-[#bfc9d4]">{item.title}</div>
                                    <div className="text-base text-blue-500 dark:text-[#bfc9d4]">{item.explanation}</div>
                                    <div className="text-xs text-white-dark">{item.author}</div>
                                </div>
                            </div>
                        </a>
                    ))
                }
            </div>
        </div>
    );
};

export default MailPlanner;
