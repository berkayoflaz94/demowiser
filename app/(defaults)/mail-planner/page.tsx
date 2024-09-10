"use client";
import React, { useEffect, useState } from 'react';
import SearchableSelect from '@/components/Select/SearchableSelect';
import { apiGeCurations, apiGetCompanyMembers, getApiCompanies, getTitles, sendMail } from '@/utils/api';
import { showMessage } from '@/utils/message';
import Loading from '@/components/layouts/loading';
import withAuth from '@/utils/withAuth';

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

    const [rowData, setRowData] = useState([]);
    const [rowDataUpdate, setRowDataUpdate] = useState(0);
    const [params, setParams] = useState(defaultParams);

    const [companyList, setCompanyList] = useState([]);
    const [titles, setTitles] = useState([]);
    const [peoples, setPeoples] = useState<any>();
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedPeople, setSelectedPeople] = useState('');

    const [curations, setCurations] = useState([]);
    const [selectedCuration, setSelectedCuration] = useState('');

    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        getApiCompanies().then((data) => setCompanyList(data));
        getTitles().then((data) => setTitles(data));

        apiGeCurations().then((data) => setCurations(data));
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

    const [sendType, setSendType] = useState('now');
    const [selectedCronTime, setSelectedCronTime] = useState('');

    const [loading, setLoading] = useState(false);

    const cronTimes = [
        {
            _id: '0 0 * * *',
            name: 'Every Day',
        },
        {
            _id: '0 0 1,15 * *',
            name: 'Every 1 day and 15 days',
        },
        {
            _id: '0 0 1 1 *',
            name: 'Every Month',
        },
        {
            _id: '0 0 1 1 1',
            name: 'Every Year',
        },
    ];

    const changeValue = (id: string, value: any) => {
        setParams((prevParams) => ({
            ...prevParams,
            [id]: value,
        }));
    };

    const handleCreateSchedule = () => {
        setClickCount(clickCount + 1);
        setLoading(true)
        let data = {
            curationId: selectedCuration,
            personId: selectedPeople
        }

        sendMail(data, clickCount)
            .then((data) => {
                if (data) {
                    showMessage('Mail sent successfully.', 'success');
                } else {
                    showMessage('Failed to send mail.', 'error');
                }
            })
            .catch((error) => {
                console.error('Error in handleCreateSchedule:', error);
                showMessage('An error occurred while sending mail.', 'error');
            }).finally(() => {
                setLoading(false);
                setSelectedCuration("");
                setSelectedPeople("");
                setSelectedCompany("");
                setSelectedTitle("");
            });
    }

    return (
        <div className="panel">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Mail Planner</h5>
            </div>
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

                {/*<div className={'w-6/12'}>
                    <button className="btn btn-primary" onClick={handleCreateRecommend}>
                        Create Recommend
                    </button>
                </div>*/}
            </div>

            {loading && <Loading type={true} />}
            <div className={"mt-8"}>
                <div className="flex flex-col">
                    <label className="sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Choose Segements</label>
                    <div className="flex flex-row gap-4">
                        <div className="mb-2">
                            <label className="inline-flex mt-1 cursor-pointer">
                                <input type="radio" name="segements" className="form-radio"
                                       defaultChecked
                                       onClick={() => setSendType('now')} />
                                <span className="text-white-dark">Send Now (One Time)</span>
                            </label>
                        </div>
                        <div className="mb-2">
                            <label className="inline-flex mt-1 cursor-pointer">
                                <input type="radio" name="segements" className="form-radio"
                                       onClick={() => setSendType('schedule')} disabled />
                                <span className="text-white-dark">Schedule Send</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {
                sendType === 'now' && (
                    <>
                        <div className={'mt-8'}>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <label>Select Collection</label>
                                    <SearchableSelect
                                        list={curations}
                                        selectedItem={selectedCuration}
                                        placeholder={"Please choose Curation"}
                                        setSelectedItem={setSelectedCuration}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            {
                sendType === 'schedule' && (
                    <>
                        <div className={"mt-8"}>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <label>Cron Job Schedule</label>
                                    <SearchableSelect
                                        list={cronTimes}
                                        selectedItem={selectedCronTime}
                                        placeholder={"Please choose schedule"}
                                        setSelectedItem={setSelectedCronTime}
                                    />
                                </div>
                                <div className="w-full">
                                    <label>Cron Job Time</label>
                                    <input type={'time'} className="form-input"/>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            <div className={"mt-8"}>
                <button className="btn btn-primary" onClick={handleCreateSchedule}>
                    {
                        sendType === 'now' ? 'Send Mail' : 'Create Schedule'
                    }
                </button>
            </div>
        </div>
    );
};

export default withAuth(MailPlanner);
