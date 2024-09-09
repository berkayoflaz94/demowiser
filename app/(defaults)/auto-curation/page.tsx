"use client";
import React, { useEffect, useState } from 'react';
import { showMessage } from '@/utils/message';
import {
    getApiCompanies,
    getTitles,
    fetchRecommendations,
    apiGetCompanyMembers,
    apiSearchRecommendations, apiPostSaveCurations
} from '@/utils/api';
import ComponentsDragndropDelete from '@/components/dragndrop/components-dragndrop-delete';
import SearchableSelect from '@/components/Select/SearchableSelect';
import Loading from '@/components/layouts/loading';

export default function AutoCurationPage() {
    const [companyList, setCompanyList] = useState([]);
    const [titles, setTitles] = useState([]);
    const [peoples, setPeoples] = useState<any>([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedPeople, setSelectedPeople] = useState('');
    const [selectedLang, setSelectLang] = useState('en');
    const [recommendations, setRecommendations] = useState<any>([]);
    const [backupRecommendations, setBackupRecommendations] = useState<any>([]);

    const [loading, setLoading] = useState(false);

    const [sendToApplication, setSendToApplication] = useState(false);

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

    const handleCreateRecommend = () => {
        setLoading(true);
        fetchRecommendations(selectedTitle, selectedCompany, selectedPeople, selectedLang).then((data) => {
            if (data && Array.isArray(data.main) && Array.isArray(data.backup)) {
                setRecommendations(data.main);
                setBackupRecommendations(data.backup);
            } else {
                showMessage('Failed to fetch valid recommendations.', 'error');
            }
        }).catch((error) => {
            console.error('Error in handleCreateRecommend:', error);
            showMessage('An error occurred while fetching recommendations.', 'error');
        }).finally(() => {
            setLoading(false); // Stop loading
        });
    };

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

    const handlePostData = (leftSide:any, sendToApplication:any, curationName: string) => {
        setLoading(true)
        let saveData = {
            "name": curationName,
            "title": selectedTitle,
            "posts": leftSide,
            "sendToApplication": sendToApplication
        }
        apiPostSaveCurations(saveData).then((data) => {
            if (data) {
                showMessage('Curation created successfully.', 'success');
            } else {
                showMessage('Failed to create curation.', 'error');
            }
        }).finally(() => setLoading(false));
    }

    return (
        <div className="panel">
            <div className="flex flex-col gap-4">
                <h5 className="text-lg font-semibold">Auto Curation</h5>
                <div className="flex gap-4">
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
                    <div className={"w-full"}>
                        <SearchableSelect
                            list={[{ _id: "en", name: "English" }, { _id: "tr", name: "Turkish" }]}
                            selectedItem={selectedLang}
                            placeholder={"Select Language"}
                            setSelectedItem={setSelectLang}
                        />
                    </div>

                    <div className={'w-fit'}>
                        <button className="btn btn-primary text-nowrap" onClick={handleCreateRecommend}>
                            Create Recommend
                        </button>
                    </div>
                </div>

                {loading && <Loading type={true} />}

                {/* Drag and Drop Component for Selected Recommendations */}
                <ComponentsDragndropDelete handlePostData={handlePostData} setSendToApplication={setSendToApplication} sendToApplication={sendToApplication} recommendations={recommendations} backupRecommendations={backupRecommendations} handleSearchRecommend={handleSearchRecommend} />

                {/* Backup Recommendations with Reload */}
            </div>
        </div>
    );
}
