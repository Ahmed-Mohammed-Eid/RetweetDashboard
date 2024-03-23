'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Image from 'next/image';

import { Badge } from 'primereact/badge';

import isValidURL from '../../../../../../helpers/isUrlValid';


export default function ListingsList({ lang }) {

    //STATE FOR THE LISTINGS
    const [listings, setListings] = React.useState([]);
    const [listingIdToDelete, setListingIdToDelete] = React.useState(null);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState(null);


    // GET THE LISTINGS FROM THE API
    function getListings() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/all/users/listings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // Check if res.data.listings is an array, if not, set it to an empty array
                let listings = Array.isArray(res.data?.listings) ? res.data.listings : [];
                // Update the state
                setListings(listings);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the listings.');
            });
    }

    // EFFECT TO GET THE LISTINGS
    useEffect(() => {
        getListings();
    }, []);


    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios.delete(`${process.env.API_URL}/delete/listing`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                listingId: listingIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Listing Deleted Successfully');
                // Hide the dialog
                setListingIdToDelete(null);
                // Update the State
                getListings();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred while deleting the listing.');
            });
    };

    // BLOCK THE LISTING HANDLER
    const blockHandler = async (listingId, status) => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios.put(`${process.env.API_URL}/block/listing`, {
            listingId: listingId,
            blockListing: status
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                // Show notification
                toast.success(lang === 'en' ? 'Action Completed Successfully' : 'تمت العملية بنجاح.');
                // Hide the dialog
                setListingIdToDelete(null);
                // Update the State
                getListings();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred while changing the listing status.');
            });
    };

    // ALLOW LISTING TO BE PUBLISHED
    const publishHandler = async (listingId) => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios.put(`${process.env.API_URL}/allow/listing`, {
            listingId: listingId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                // Show notification
                toast.success(lang === 'en' ? 'Action Completed Successfully' : 'تمت العملية بنجاح.');
                // Hide the dialog
                setListingIdToDelete(null);
                // Update the State
                getListings();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred while changing the listing status.');
            });
    };


    const footerContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setListingIdToDelete(null)}
                className="p-button-text" />
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    deleteHandler();
                }}
                style={{
                    backgroundColor: '#dc3545',
                    color: '#fff'
                }}
                autoFocus />
        </div>
    );

    return (
        <>
            <DataTable
                value={listings || []}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                style={{ width: '100%' }}
                paginator
                rows={25}
                rowsPerPageOptions={[25, 50, 100]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                header={lang === 'en' ? 'Listings' : 'الإعلانات'}
                emptyMessage="No listings found"
                className="p-datatable-sm"
            >
                <Column
                    field="listingImages[0]"
                    header={lang === 'en' ? 'Image' : 'صورة '}
                    body={(rowData) => {
                        return (
                            <Image
                                src={isValidURL(rowData?.listingImages[0]) ? (rowData?.listingImages[0]) : '/not-found.jpg'}
                                alt={lang === 'en' ? rowData?.listingTitleEn : rowData?.listingTitle}
                                width={100}
                                height={100}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '2px solid #f1f1f1'
                                }}
                            />
                        );
                    }}
                />

                <Column
                    field="listingTitle"
                    header={lang === 'en' ? 'Listing Title (Arabic)' : 'الاسم'}
                    sortable
                    filter
                />

                <Column
                    field="listingItem"
                    header={lang === 'en' ? 'Item' : 'العنصر'}
                    sortable
                    filter
                />

                <Column
                    field={'listingStatus'}
                    header={lang === 'en' ? 'Status' : 'الحالة'}
                    sortable
                    filter
                    body={(rowData) => {
                        return (
                            <Badge
                                value={rowData.listingStatus}
                                style={{ textTransform: 'capitalize' }}
                                severity={rowData.listingStatus === 'promoted' ? 'success' : 'warning'}
                            />
                        );
                    }}
                />

                <Column
                    field={'listingCountry'}
                    header={lang === 'en' ? 'Country' : 'الدولة'}
                    sortable
                    filter
                />

                <Column
                    field={'listingCity'}
                    header={lang === 'en' ? 'City' : 'المدينة'}
                    sortable
                    filter
                />

                <Column
                    field={'_id'}
                    header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="copyButton"
                                    onClick={() => {
                                        setDetailsVisible(true);
                                        setSelectedCategory(rowData);
                                    }}
                                >
                                    {lang === 'en' ? 'Details' : 'التفاصيل'}
                                </button>
                                <button
                                    className={'editButton'}
                                    onClick={() => {
                                        publishHandler(rowData._id);
                                    }}
                                >
                                    {lang === 'en' ? 'Publish' : 'نشر'}
                                </button>
                                <button
                                    className={rowData?.blockListing ? 'unblockButton' : 'blockButton'}
                                    onClick={() => {
                                        blockHandler(rowData._id, !rowData?.blockListing);
                                    }}
                                >
                                    {lang === 'en' ? (rowData?.blockListing ? 'Unblock' : 'Block') : (rowData?.blockListing ? 'إلغاء الحظر' : 'حظر')}
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setListingIdToDelete(rowData._id);
                                    }}
                                >
                                    {lang === 'en' ? 'Delete' : 'حذف'}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Listing"
                visible={listingIdToDelete}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setListingIdToDelete(null)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    {lang === 'en' ? 'Are you sure you want to delete this listing?' : 'هل أنت متأكد أنك تريد حذف هذا القسم؟'}
                </p>
            </Dialog>

            <Dialog
                header="DETAILS"
                visible={detailsVisible}
                position={'center'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setDetailsVisible(false)}
                draggable={false}
                resizable={false}
            >
                <div
                    className={'grid'}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                    <div className="field col-12 relative">
                        <h4>
                            {lang === 'en' ? 'Category Image' : 'صورة القسم'}
                        </h4>
                        <Image
                            src={isValidURL(selectedCategory?.listingImages[0]) ? selectedCategory?.listingImages[0] : '/not-found.jpg'}
                            alt={selectedCategory?.title}
                            width={600}
                            height={300}
                            style={{ width: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="field col-12 relative flex">
                        <div className="field col-12">
                            <h4>
                                {lang === 'en' ? 'Listing Name' : 'اسم القسم'}
                            </h4>
                            <p>{selectedCategory?.listingTitle}</p>
                        </div>
                    </div>

                    <div className="field col-12">
                        <h4>
                            {lang === 'en' ? 'Listing Description' : 'وصف القسم'}
                        </h4>
                        <p>
                            {selectedCategory?.listingDescription}
                        </p>
                    </div>


                    {/*ITEM*/}
                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'SubCategory Item' : 'القسم'}
                        </h4>
                        <p>
                            {selectedCategory?.listingItem}
                        </p>
                    </div>

                    {/*PRICE*/}
                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'Price' : 'السعر'}
                        </h4>
                        <p>
                            <b>{selectedCategory?.listingPrice} {selectedCategory?.listingCurrency}</b>
                        </p>
                    </div>

                    {/*COUNTRY*/}
                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'Country' : 'الدولة'}
                        </h4>
                        <p>
                            {selectedCategory?.listingCountry}
                        </p>
                    </div>

                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'City' : 'المدينة'}
                        </h4>
                        <p>
                            {selectedCategory?.listingCity}
                        </p>
                    </div>

                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'Neighborhood' : 'الحي'}
                        </h4>
                        <p>
                            {selectedCategory?.neighbourhood}
                        </p>
                    </div>

                    {/*CONTACT PHONE*/}
                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'Contact Phone' : 'رقم الهاتف'}
                        </h4>
                        <p>
                            {selectedCategory?.contactPhone}
                        </p>
                    </div>

                    {/*CREATED AT*/}
                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'Created At' : 'تاريخ الإنشاء'}
                        </h4>
                        <p>
                            {new Date(selectedCategory?.createdAt).toLocaleString()}
                        </p>
                    </div>

                    {/*UPDATED AT*/}
                    <div className={'field col-6'}>
                        <h4>
                            {lang === 'en' ? 'Updated At' : 'تاريخ التحديث'}
                        </h4>
                        <p>
                            {new Date(selectedCategory?.updatedAt).toLocaleString()}
                        </p>
                    </div>

                    {/*  IMAGES  */}
                    <div className={'field col-12'}>
                        <h4>
                            {lang === 'en' ? 'Images' : 'الصور'}
                        </h4>
                        <div className={'grid gap-2'}>
                            {selectedCategory?.listingImages?.map((img, index) => (
                                <>
                                    <Image
                                        key={index}
                                        src={isValidURL(img) ? img : '/not-found.jpg'}
                                        alt={selectedCategory?.listingTitle}
                                        width={100}
                                        height={100}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </Dialog>

        </>
    )
        ;
}