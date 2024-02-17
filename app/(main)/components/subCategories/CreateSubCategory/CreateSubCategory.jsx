"use client";
import React, { useEffect, useState } from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";
import { Dropdown } from 'primereact/dropdown';

export default function CreateSubCategory() {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        subCategoryName: "",
        subCategoryNameEn: "",
        mainCategoryId: "",
        files: []
    });

    // HANDLERS
    function createSubCategory(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.subCategoryName || !form.subCategoryNameEn || !form?.mainCategoryId || !form.files || form.files.length < 1) {
            toast.error("Please fill all the fields.");
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE TITLE
        formData.append("subCategoryName", form.subCategoryName);
        formData.append("subCategoryNameEn", form.subCategoryNameEn);
        formData.append("mainCategoryId", form.mainCategoryId);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/create/sub/category`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Sub Category created successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the sub category.");
                setLoading(false);
            })
    }

    function getCategories() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(res => {
                const categories = res.data?.categories || [];
                // LOOP THROUGH THE CATEGORIES AND FORMAT THEM AS {label: "categoryName", value: "_id"}
                const formattedCategories = categories.map(category => {
                    return {
                        label: `${category?.categoryNameEn} ( ${category.categoryName} )`,
                        value: category._id
                    }
                });
                // Update the state
                setCategories(formattedCategories);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the categories.");
            })
    }

    // EFFECT TO GET THE CATEGORIES
    useEffect(() => {
        getCategories();
    }, []);


    return (
        <div className={"card mb-0"}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Create Sub Category</h1>
            <form className="grid formgrid p-fluid" onSubmit={createSubCategory}>
                <div className="field col-12">
                    <label htmlFor="mainCategoryId">Main Category</label>
                    <Dropdown
                        id="mainCategoryId"
                        value={form?.mainCategoryId}
                        options={categories || []}
                        onChange={(e) => setForm({...form, mainCategoryId: e.value})}
                        placeholder={"Select the main category"}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="subCategoryName">Name (عربي)</label>
                    <InputText
                        id="subCategoryName"
                        type="text"
                        placeholder={"Enter the name in arabic"}
                        value={form.subCategoryName}
                        onChange={(e) => setForm({ ...form, subCategoryName: e.target.value })}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="subCategoryNameEn">Name (English)</label>
                    <InputText
                        id="subCategoryNameEn"
                        type="text"
                        placeholder={"Enter the name in english"}
                        value={form.subCategoryNameEn}
                        onChange={(e) => setForm({ ...form, subCategoryNameEn: e.target.value })}
                    />
                </div>
                <div className="col-12 mb-2 lg:mb-2">
                    <label className={"mb-2 block"} htmlFor="male-image">Files</label>
                    <CustomFileUpload
                        setFiles={(files) => {
                            setForm({ ...form, files })
                        }}
                        removeThisItem={(index) => {
                            // ITEMS COPY
                            const items = [...form?.files || []]
                            // FILTER THE ITEMS
                            const newItems = items.filter((item, i) => {
                                return i !== index
                            })
                            // SET THE STATE
                            setForm({ ...form, files: newItems })
                        }}
                    />
                </div>
                <div className="field col-12 md:col-6 mt-4 ml-auto">
                    <Button
                        type={"submit"}
                        label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                          style={{
                                                              width: '2rem',
                                                              height: '2rem'
                                                          }} /> : `CREATE SUB CATEGORY`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}