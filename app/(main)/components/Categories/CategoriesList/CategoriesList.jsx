'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Image from 'next/image';
import isValidURL from '../../../../../helpers/isUrlValid';


export default function CategoriesList() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE CATEGORIES
    const [categories, setCategories] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState(null);


    // GET THE CATEGORIES FROM THE API
    function getCategories() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // Check if res.data.categories is an array, if not, set it to an empty array
                let categories = Array.isArray(res.data?.categories) ? res.data.categories : [];
                // Update the state
                setCategories(categories);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the categories.');
            });
    }

    // EFFECT TO GET THE CATEGORIES
    useEffect(() => {
        getCategories();
    }, []);


    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios.delete(`${process.env.API_URL}/delete/category`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                categoryId: categoryIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Category Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getCategories();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred while deleting the category.');
            });
    };

    const footerContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
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
                value={categories || []}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No categories found."
            >
                <Column
                    field="categoryImage"
                    header="Category Image"
                    body={(rowData) => {
                        return (
                            <Image
                                src={isValidURL(rowData?.categoryImage) ? (rowData?.categoryImage) : '/not-found.jpg'}
                                alt={rowData?.title}
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
                    field="categoryName"
                    header="Category Name"
                    sortable
                    filter
                />
                <Column
                    field="categoryNameEn"
                    header="Category Name (English)"
                    sortable
                    filter
                />

                <Column
                    field={'_id'}
                    header={'Actions'}
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
                                    View Details
                                </button>
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/categories/${rowData._id}`);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setCategoryIdToDelete(rowData._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Category"
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this category?
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
                <div className={'flex flex-column'}>
                    <div className="field col-12 relative">
                        <h4>Category Image</h4>
                        <Image
                            src={isValidURL(selectedCategory?.categoryImage) ? selectedCategory?.categoryImage : '/not-found.jpg'}
                            alt={selectedCategory?.title}
                            width={600}
                            height={300}
                            style={{ width: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="field col-12 relative flex">
                        <div className="field col-6">
                            <h4>Category Name (Arabic)</h4>
                            <p>{selectedCategory?.categoryName}</p>
                        </div>
                        <div className="field col-6">
                            <h4>Category Name (English)</h4>
                            <p>{selectedCategory?.categoryNameEn}</p>
                        </div>
                    </div>
                    <div className="field col-12">
                        <h4>Sub Categories</h4>
                        <div className="flex flex-row flex-wrap gap-2">
                            {selectedCategory?.subCategories?.map((file, index) => {
                                return (
                                    <div className={'flex flex-column gap-4'} key={file?._id}>
                                        <Image
                                            width={100}
                                            height={100}
                                            key={index}
                                            src={isValidURL(file?.subCategoryImage) ? file?.subCategoryImage : '/not-found.jpg'}
                                            alt={file}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <p>{file?.subCategoryNameEn} - ({file?.subCategoryName})</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Dialog>

        </>
    );
}