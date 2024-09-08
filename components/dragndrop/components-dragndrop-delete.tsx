'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Dialog, Transition } from '@headlessui/react';
import SearchableSelect from '@/components/Select/SearchableSelect';

type ComponentsDragndropDeleteProps = {
    recommendations?: any[];
    backupRecommendations?: any[];
    setSendToApplication?: any;
    sendToApplication?: any;
    handleSearchRecommend?: any;
    handlePostData?: any;
};

const ComponentsDragndropDelete: React.FC<ComponentsDragndropDeleteProps> = ({
     recommendations = [],
     backupRecommendations = [],
     setSendToApplication,
     sendToApplication,
     handleSearchRecommend,
     handlePostData
                                                                             }) => {
    const [leftSideData, setLeftSideData] = useState(recommendations || []);
    const [backupRecommendationsInner, setBackupRecommendationsInner] = useState(backupRecommendations || []);
    const [selectedRecommendations, setSelectedRecommendations] = useState<any>([]);
    const [searchInput, setSearchInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditingItem, setCurrentEditingItem] = useState<any>(null);
    const [inputValue, setInputValue] = useState('');
    const [curationName, setCurationName] = useState('');

    useEffect(() => {
        setBackupRecommendationsInner(backupRecommendations || []);
    }, [backupRecommendations]);

    useEffect(() => {
        setLeftSideData(recommendations || []);
    }, [recommendations]);

    const openModal = (item: any) => {
        setCurrentEditingItem(item);
        setInputValue(item.explanation || ''); // Use the saved newData if exists, otherwise empty
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setInputValue('');
        setCurrentEditingItem(null);
    };

    const handleSave = () => {
        if (currentEditingItem) {
            // Update the specific recommendation with new data
            const updatedRecommendations = leftSideData.map((item) =>
                item === currentEditingItem ? { ...item, explanation: inputValue } : item
            );
            setLeftSideData(updatedRecommendations);
        }
        closeModal();
    };

    const handleGoToLink = () => {
        if (currentEditingItem && currentEditingItem.url) {
            window.open(currentEditingItem.url, '_blank');
        }
    };

    if (recommendations.length === 0 && backupRecommendations.length === 0) return null;

    return (
        <div className="panel">
            <div className="mb-5 text-lg font-semibold dark:text-white">Select Recommendations</div>
            <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                {/* Drag & Drop List for Left Side Items */}
                <div>
                    <ul id="recommendations-list">
                        <ReactSortable
                            list={leftSideData}
                            setList={setLeftSideData}
                            animation={200}
                            group={{ name: 'recommendations', pull: true, put: true }}
                            className="min-h-[200px]"
                        >
                            {leftSideData.map((item, index) => (
                                <li key={index} className="mb-2.5 cursor-pointer" onClick={() => openModal(item)}>
                                    {item.benefit === "Yüksek" ? (
                                        <span className={"badge bg-success"}>Yüksek</span>
                                    ) : item.benefit === "Orta" ? (
                                        <span className={"badge bg-warning"}>Orta</span>
                                    ) : item.benefit === "Düşük" ? (
                                        <span className={"badge bg-danger"}>Düşük</span>
                                    ) : (
                                        <span className={"badge bg-primary"}>{item.benefit}</span>
                                    )}
                                    <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 relative ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                        <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                            <img alt="avatar" src={item.image} className="mx-auto h-11 w-11 rounded-full" />
                                        </div>
                                        <div className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                            <div className="my-3 font-semibold md:my-0">
                                                <div className="text-base text-dark dark:text-[#bfc9d4]">{item.title}</div>
                                                <div className="text-base text-blue-500 dark:text-[#bfc9d4]">{item.explanation}</div>
                                                <div className="text-xs text-white-dark">{item.author}</div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ReactSortable>

                        <div className="flex justify-center mt-5 flex-col gap-5 items-center">
                            <div className={"flex justify-center"}>
                                <input type="checkbox" id={"sendToApplication"} onClick={() => setSendToApplication(!sendToApplication)} />
                                <label htmlFor={"sendToApplication"} className="ml-2 mb-0">Send To Wiser Application</label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Curation Name"
                                    className="input form-input"
                                    value={curationName}
                                    onChange={(e) => setCurationName(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePostData(leftSideData, sendToApplication, curationName)}
                            >
                                Save
                            </button>
                        </div>
                    </ul>
                </div>

                {/* Modal for Adding New Recommendation Data */}
                <Transition appear show={isModalOpen} as={Fragment}>
                    <Dialog as="div" open={isModalOpen} onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">Add & Edit Explanation</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={closeModal}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                className="form-input mb-3"
                                                placeholder="Enter new data"
                                            />
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={closeModal}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleSave}>
                                                    Save
                                                </button>
                                                {currentEditingItem?.url && (
                                                    <button type="button" className="btn btn-link ltr:ml-4 rtl:mr-4" onClick={handleGoToLink}>
                                                        Go to Link
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                {/* Backup Items List with Reload Button */}
                <div>
                    <div className={"flex flex-row mb-7 gap-4"}>
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
                        <div className={'w-fit'}>
                            <button type="button"
                                    onClick={() => handleSearchRecommend(selectedRecommendations, searchInput)}
                                    className={'btn btn-primary'}>Search
                            </button>
                        </div>
                    </div>
                    <ul id="backup-list">
                        <ReactSortable
                            list={backupRecommendationsInner}
                            setList={setBackupRecommendationsInner}
                            animation={200}
                            group={{ name: 'recommendations', pull: true, put: true }}
                            className="min-h-[200px] max-h-[650px] overflow-y-auto"
                        >
                            {backupRecommendationsInner.map((item, index) => (
                                <li key={index} className="mb-2.5 cursor-grab">
                                    {item.benefit === "Yüksek" ? (
                                        <span className={"badge bg-success"}>Yüksek</span>
                                    ) : item.benefit === "Orta" ? (
                                        <span className={"badge bg-warning"}>Orta</span>
                                    ) : item.benefit === "Düşük" ? (
                                        <span className={"badge bg-danger"}>Düşük</span>
                                    ) : (
                                        <span className={"badge bg-primary"}>{item.benefit}</span>
                                    )}
                                    <div
                                        className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 ltr:text-left rtl:text-right dark:border-dark dark:bg-[#1b2e4b] md:flex-row">
                                        <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                            <img alt="avatar" src={item.image}
                                                 className="mx-auto h-11 w-11 rounded-full" />
                                        </div>
                                        <div
                                            className="flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left">
                                            <div className="my-3 font-semibold md:my-0">
                                                <div
                                                    className="text-base text-dark dark:text-[#bfc9d4]">{item.title}</div>
                                                <div
                                                    className="text-base text-blue-500 dark:text-[#bfc9d4]">{item.explanation}</div>
                                                <div className="text-xs text-white-dark">{item.author}</div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ReactSortable>
                    </ul>
                    <div className="flex justify-between items-center mt-7">
                        <button className="btn btn-secondary ms-auto"
                                onClick={() => setBackupRecommendationsInner(backupRecommendations)}>
                            Reload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentsDragndropDelete;
