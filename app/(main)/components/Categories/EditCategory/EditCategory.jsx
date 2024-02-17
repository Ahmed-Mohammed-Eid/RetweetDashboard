"use client";
import React, {useState, useEffect} from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

export default function EditCategory({categoryId}) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        categoryName: "",
        categoryNameEn: "",
        files: []
    });

    function getCategory(id) {
        // GET THE TOKEN FROM THE COOKIES
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/get/category?categoryId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const category = res.data.category;
                setForm({
                    categoryName: category.categoryName,
                    categoryNameEn: category.categoryNameEn,
                    files: []
                })
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the category.');
            })
    }

    // EFFECT TO SET THE FORM VALUES
    useEffect(() => {
        getCategory(categoryId);
    }, [categoryId]);

    // HANDLERS
    function editCategory(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");


        // VALIDATE THE FORM
        if (!form.categoryName || !form.categoryNameEn) {
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
        formData.append("categoryName", form.categoryName);
        formData.append("categoryNameEn", form.categoryNameEn);
        formData.append("categoryId", categoryId);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/category`, formData, {
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
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Edit Category</h1>
            <form className="grid formgrid p-fluid" onSubmit={editCategory}>
                <div className="field col-12 md:col-6">
                    <label htmlFor="categoryName">Category Name (عربي)</label>
                    <InputText
                        id="categoryName"
                        type="text"
                        placeholder={"Enter the category name arabic"}
                        value={form.categoryName}
                        onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="categoryNameEn">Category Name (English)</label>
                    <InputText
                        id="categoryNameEn"
                        type="text"
                        placeholder={"Enter the category name english"}
                        value={form.categoryNameEn}
                        onChange={(e) => setForm({ ...form, categoryNameEn: e.target.value })}
                    />
                </div>
                <div className="col-12 mb-2 lg:mb-2">
                    <label className={"mb-2 block"} htmlFor="male-image">Category Files</label>
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
                                                          }} /> : `EDIT CATEGORY`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}