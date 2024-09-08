// @ts-nocheck
"use client";
import React, { Fragment, useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import IconPlus from '@/components/icon/icon-plus';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/icon/icon-x';
import { apiPostDeleteTitle, apiPostSaveTitle, apiPostUpdateTitle, getTitles } from '@/utils/api';
import { showMessage } from '@/utils/message';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import TagInput from '@/components/Select/TagInput';

export default function Page() {
    const [rowData, setRowData] = useState([]);
    const [rowDataUpdate, setRowDataUpdate] = useState(0);

    const [isDeleteNoteModal, setIsDeleteNoteModal] = useState(false);
    const [deletedNote, setDeletedNote] = useState(null);

    const [page1, setPage1] = useState(1);
    const [pageSize1, setPageSize1] = useState(10);
    const [initialRecords1, setInitialRecords1] = useState(rowData);
    const [recordsData1, setRecordsData1] = useState(initialRecords1);
    const [search1, setSearch1] = useState('');

    const defaultParams = {
        _id: null,
        name: '',
        keywords: [] as string[],
    };

    const [isShowNoteMenu, setIsShowNoteMenu] = useState(false);
    const [params, setParams] = useState(defaultParams);
    const [addContactModal, setAddContactModal] = useState(false);

    useEffect(() => {
        getTitles().then((data) => {
            setRowData(data);
            setInitialRecords1(data);
            setRecordsData1(data.slice(0, pageSize1));
        });
    }, [rowDataUpdate]);

    useEffect(() => {
        const from = (page1 - 1) * pageSize1;
        const to = from + pageSize1;
        setRecordsData1([...initialRecords1.slice(from, to)]);
    }, [page1, pageSize1, initialRecords1, rowData]);

    useEffect(() => {
        setInitialRecords1(() => {
            return rowData.filter((item) => {
                return (
                    item._id.toString().includes(search1.toLowerCase()) ||
                    item.name.toLowerCase().includes(search1.toLowerCase()) ||
                    item.keywords.join(', ').toLowerCase().includes(search1.toLowerCase())
                );
            });
        });
    }, [search1]);

    const addTitle = (title: any = null) => {
        setIsShowNoteMenu(false);
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (title) {
            let json1 = JSON.parse(JSON.stringify(title));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const saveTitle = () => {
        if (!params.name) {
            showMessage('Name is required.', 'error');
            return false;
        }
        if (params._id) {
            apiPostUpdateTitle(params).then(() => {
                setRowDataUpdate(rowDataUpdate + 1);
            });
        } else {
            apiPostSaveTitle(params).then(() => {
                setRowDataUpdate(rowDataUpdate + 1);
            });
        }
        showMessage('Item has been saved successfully.');
        setAddContactModal(false);
    };

    const changeValue = (id: string, value: any) => {
        setParams((prevParams) => ({
            ...prevParams,
            [id]: value,
        }));
    };

    const deleteNoteConfirm = (note: any) => {
        setDeletedNote(note);
        setIsDeleteNoteModal(true);
    };

    const deleteNote = () => {
        apiPostDeleteTitle(deletedNote).then(() => {
            setRowDataUpdate(rowDataUpdate + 1);
        });
        showMessage('Title has been deleted successfully.');
        setIsDeleteNoteModal(false);
    };

    return (
        <>
            <div className="panel">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">List Titles</h5>
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search1} onChange={(e) => setSearch1(e.target.value)} />
                </div>
                <div className="datatables">
                    {rowData.length === 0 ? <div className="text-center">No records found.</div> : ''}
                    {rowData.length > 0 && (
                        <DataTable
                            highlightOnHover
                            className="table-hover whitespace-nowrap"
                            records={recordsData1}
                            columns={[
                                { accessor: '_id', title: 'ID' },
                                { accessor: 'name', title: 'Name' },
                                {
                                    accessor: 'keywords',
                                    title: 'Keywords',
                                    render: (record) => record.keywords.join(', '),
                                },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    textAlignment: 'center',
                                    render: (record) => (
                                        <div className="flex gap-1 justify-center">
                                            <button className="btn btn-primary btn-sm" onClick={() => addTitle(record)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteNoteConfirm(record)}>
                                                <IconTrashLines className="h-4.5 w-4.5 shrink-0" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords1.length}
                            recordsPerPage={pageSize1}
                            page={page1}
                            onPageChange={(p) => setPage1(p)}
                            recordsPerPageOptions={[10, 20, 30, 50, 100]}
                            onRecordsPerPageChange={setPageSize1}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    )}
                </div>
                <div>
                    <button className="btn btn-primary ms-auto me-0 mt-4" type="button" onClick={() => addTitle()}>
                        <IconPlus className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                        Add New Title
                    </button>
                </div>

                <Transition appear show={addContactModal} as={Fragment}>
                    <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-50">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setAddContactModal(false)}
                                            className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-4 rtl:pr-4 dark:bg-[#121c2c]">
                                            {params._id ? 'Edit Title' : 'Add Title'}
                                        </div>
                                        <div className="p-5">
                                            <div className="mb-5">
                                                <label htmlFor="name">Title</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Enter Name"
                                                    value={params.name}
                                                    onChange={(e) => changeValue('name', e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-5">
                                                <label htmlFor="keywords">Keywords</label>
                                                <TagInput
                                                    keywords={params.keywords}
                                                    changeValue={(newKeywords) => changeValue('keywords', newKeywords)}
                                                />
                                            </div>

                                            <button className="btn btn-primary mt-8 w-full" onClick={saveTitle}>
                                                Save Title
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={isDeleteNoteModal} as={Fragment}>
                    <Dialog as="div" open={isDeleteNoteModal} onClose={() => setIsDeleteNoteModal(false)} className="relative z-50">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setIsDeleteNoteModal(false)}
                                            className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-4 rtl:pr-4 dark:bg-[#121c2c]">
                                            Delete Note
                                        </div>
                                        <div className="p-5">
                                            <p>Are you sure you want to delete this note?</p>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={deleteNote}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
}
