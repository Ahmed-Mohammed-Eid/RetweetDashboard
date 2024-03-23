"use client";
import React, {useState} from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";
import { Dropdown } from 'primereact/dropdown';

export default function CreateCategory({lang}) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        categoryName: "",
        categoryNameEn: "",
        files: [],
        formType: ""
    });

    // HANDLERS
    function createCategory(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.categoryName || !form.categoryNameEn || !form.files || form.files.length < 1) {
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
        formData.append("categoryName", form.categoryName);
        formData.append("categoryNameEn", form.categoryNameEn);
        formData.append("formType", form.formType);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/create/category`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Category created successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the category.");
                setLoading(false);
            })
    }


    return (
        <div className={"card mb-0"} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>
                {lang === 'en' ? 'Create Category' : 'إنشاء تصنيف'}
            </h1>
            <form className="grid formgrid p-fluid" onSubmit={createCategory}>
                <div className="field col-12 md:col-6">
                    <label htmlFor="categoryName">{lang === 'en' ? 'Category Name (عربي)' : 'اسم التصنيف (عربي)'}</label>
                    <InputText
                        id="categoryName"
                        type="text"
                        placeholder={lang === 'en' ? "Enter the category name arabic" : "أدخل اسم التصنيف بالعربية"}
                        value={form.categoryName}
                        onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="categoryNameEn">{lang === 'en' ? 'Category Name (English)' : 'اسم التصنيف (إنجليزي)'}</label>
                    <InputText
                        id="categoryNameEn"
                        type="text"
                        placeholder={lang === 'en' ? "Enter the category name english" : "أدخل اسم التصنيف بالإنجليزية"}
                        value={form.categoryNameEn}
                        onChange={(e) => setForm({ ...form, categoryNameEn: e.target.value })}
                    />
                </div>

                <div className="col-12 mb-2 lg:mb-2" dir={'ltr'}>
                    <label className={"mb-2 block"} htmlFor={"formType"} dir={lang === "en" ? 'ltr' : 'rtl'}>
                        {lang === 'en' ? 'Form Type' : 'نوع النموذج'}
                    </label>
                    <Dropdown
                        id={"formType"}
                        value={form.formType}
                        options={[
                            {
                                label: lang === 'en' ? 'Cars' : 'سيارات',
                                value: 'cars'
                            },
                            {
                                label: lang === 'en' ? 'Real Estate' : 'عقارات',
                                value: 'real-estate'
                            },
                            {
                                label: lang === 'en' ? 'Mobiles & Tablets' : 'موبايلات وتابلت',
                                value: 'mobiles-tablets'
                            },
                            {
                                label: lang === 'en' ? 'Video Games' : 'ألعاب فيديو',
                                value: 'video-games'
                            },
                            {
                                label: lang === 'en' ? 'Laptops & Computers' : 'لابتوبات وكمبيوترات',
                                value: 'laptops-computers' },
                            {
                                label: lang === 'en' ? 'Home Appliances & Electronics' : 'أجهزة منزلية وإلكترونيات',
                                value: 'home-appliances-electronics' },
                            {
                                label: lang === 'en' ? 'Home & Garden' : 'المنزل والحديقة',
                                value: 'home-garden' },
                            {
                                label: lang === 'en' ? 'Jobs' : 'وظائف',
                                value: 'jobs'
                            },
                            {
                                label: lang === 'en' ? 'Clothing & Accessories' : 'ملابس وإكسسوارات',
                                value: 'clothing-accessories' },
                            {
                                label: lang === 'en' ? 'Children supplies' : 'مستلزمات الأطفال',
                                value: 'children-supplies' },
                            {
                                label: lang === 'en' ? 'Services' : 'خدمات',
                                value: 'services' },
                            {
                                label: lang === 'en' ? 'Food & Nutritions' : 'طعام وتغذية',
                                value: 'food-nutritions' },
                            {
                                label: lang === 'en' ? 'Education & Training' : 'تعليم وتدريب',
                                value: 'education-training' },
                            {
                                label: lang === 'en' ? 'Books & Hobbies' : 'كتب وهوايات',
                                value: 'books-hobbies' },
                            {
                                label: lang === 'en' ? 'Animals' : 'حيوانات',
                                value: 'animals'
                            },
                            {
                                label: lang === 'en' ? 'Sports & Fitness' : 'رياضة ولياقة',
                                value: 'sports-fitness' },
                            {
                                label: lang === 'en' ? 'Companies & Office Tools' : 'شركات وأدوات مكتبية',
                                value: 'companies-office-tools' },
                            {
                                label: lang === 'en' ? 'Home &Garden' : 'المنزل والحديقة',
                                value: 'home-garden'
                            },
                        ]}
                        onChange={(e) => setForm({ ...form, formType: e.value })}
                        placeholder={lang === 'en' ? 'Select the form type' : 'اختر نوع النموذج'}
                    />
                </div>

                <div className="col-12 mb-2 lg:mb-2" dir={'ltr'}>
                    <label className={"mb-2 block"} htmlFor="male-image" dir={lang === "en" ? 'ltr' : 'rtl'}>
                        {lang === 'en' ? 'Category Image' : 'صورة التصنيف'}
                    </label>
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
                                                          }} /> : `${lang === 'en' ? 'Create' : 'إنشاء'}`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}