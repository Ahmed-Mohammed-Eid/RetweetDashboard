"use client";
import React, {useState, useEffect} from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";
import { Dropdown } from 'primereact/dropdown';

export default function EditSubCategory({subCategoryId}) {

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

    function getSubCategory(id) {
        // GET THE TOKEN FROM THE COOKIES
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/sub/category?subCategoryId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const subCategory = res.data;
                console.log(subCategory);
                setForm({
                    subCategoryName: subCategory?.subCategory?.subCategoryName,
                    subCategoryNameEn: subCategory?.subCategory?.subCategoryNameEn,
                    mainCategoryId: subCategory?.subCategory?.mainCategoryId,
                    files: []
                })
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the category.');
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


    // EFFECT TO SET THE FORM VALUES
    useEffect(() => {
        getCategories();
        getSubCategory(subCategoryId);
    }, [subCategoryId]);

    // HANDLERS
    function editSubCategory(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");


        // VALIDATE THE FORM
        if (!form.subCategoryName || !form.subCategoryNameEn) {
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
        // APPEND THE TITLE
        formData.append("subCategoryName", form.subCategoryName);
        formData.append("subCategoryNameEn", form.subCategoryNameEn);
        formData.append("mainCategoryId", form.mainCategoryId);
        formData.append("subCategoryId", subCategoryId);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/sub/category`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Media created successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the category.");
                setLoading(false);
            })
    }


    return (
        <div className={"card mb-0"}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Edit Sub Category</h1>
            <form className="grid formgrid p-fluid" onSubmit={editSubCategory}>
                <div className="field col-12">
                    <label htmlFor="mainCategoryId">Main Category</label>
                    <Dropdown
                        id="mainCategoryId"
                        value={form.mainCategoryId}
                        options={categories || []}
                        onChange={(e) => setForm({ ...form, mainCategoryId: e.value })}
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
                                                          }} /> : `EDIT SUB CATEGORY`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}