'use client';
import React, { useEffect, useState } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

export default function CreateSubCategory({ lang }) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        subCategoryName: '',
        subCategoryNameEn: '',
        mainCategoryId: '',
        files: []
    });
    const [items, setItems] = useState({
        itemsNumber: 0,
        items: []
    });

    // HANDLERS
    function createSubCategory(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (!form.subCategoryName || !form.subCategoryNameEn || !form?.mainCategoryId || !form.files || form.files.length < 1) {
            toast.error(lang === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Please fill all the fields');
            return;
        }

        // CHECK THAT THE ITEMS ARRAY OBJECTS HAVE THE SAME LENGTH AS THE ITEMS NUMBER AND EVERY OBJECT HAS A NAME IN ARABIC AND ENGLISH AND THERE IS NO EMPTY STRINGS
        if (items.items.length !== items.itemsNumber || items.items.some(item => !item.nameAR || !item.nameEN || item.nameAR === '' || item.nameEN === '')) {
            return toast.error(lang === 'en' ? 'Please fill all the fields' : 'من فضلك املأ جميع الحقول');
        }

        // CREATE 2 ARRAYS OF ITEMS NAMES IN ARABIC AND ENGLISH
        const itemsAr = items.items.map(item => item.nameAR);
        const itemsEn = items.items.map(item => item.nameEN);

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE TITLE
        formData.append('subCategoryName', form.subCategoryName);
        formData.append('subCategoryNameEn', form.subCategoryNameEn);
        formData.append('mainCategoryId', form.mainCategoryId);
        formData.append('items', itemsAr);
        formData.append('itemsEn', itemsEn);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append('files', form.files[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/create/sub/category`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || 'Sub Category created successfully.');
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while creating the sub category.');
                setLoading(false);
            });
    }

    function getCategories() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const categories = res.data?.categories || [];
                // LOOP THROUGH THE CATEGORIES AND FORMAT THEM AS {label: "categoryName", value: "_id"}
                if (lang === 'en') {
                    const formattedCategories = categories.map(category => {
                        return {
                            label: `${category?.categoryNameEn} ( ${category.categoryName} )`,
                            value: category._id
                        };
                    });
                    // Update the state
                    setCategories(formattedCategories);
                } else {
                    const formattedCategories = categories.map(category => {
                        return {
                            label: `${category?.categoryName} ( ${category.categoryNameEn} )`,
                            value: category._id
                        };
                    });
                    // Update the state
                    setCategories(formattedCategories);
                }
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the categories.');
            });
    }

    // EFFECT TO GET THE CATEGORIES
    useEffect(() => {
        getCategories();
    }, []);


    return (
        <form
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            onSubmit={createSubCategory}
        >
            <div className="card mb-2">
                <h1 className={'text-2xl font-bold mb-4 uppercase'}>
                    {lang === 'ar' ? 'إنشاء فئة فرعية' : 'Create Sub Category'}
                </h1>
                <div className="grid formgrid p-fluid">
                    <div className="field col-12">
                        <label htmlFor="mainCategoryId">
                            {lang === 'ar' ? 'القسم الرئيسي' : 'Main Category'}
                        </label>
                        <Dropdown
                            id="mainCategoryId"
                            value={form?.mainCategoryId}
                            options={categories || []}
                            onChange={(e) => setForm({ ...form, mainCategoryId: e.value })}
                            placeholder={lang === 'ar' ? 'اختر القسم الرئيسي' : 'Select the main category'}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="subCategoryName">
                            {lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
                        </label>
                        <InputText
                            id="subCategoryName"
                            type="text"
                            placeholder={lang === 'ar' ? 'أدخل الاسم بالعربية' : 'Enter the name in arabic'}
                            value={form.subCategoryName}
                            onChange={(e) => setForm({ ...form, subCategoryName: e.target.value })}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="subCategoryNameEn">
                            {lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}
                        </label>
                        <InputText
                            id="subCategoryNameEn"
                            type="text"
                            placeholder={lang === 'ar' ? 'أدخل الاسم بالإنجليزية' : 'Enter the name in english'}
                            value={form.subCategoryNameEn}
                            onChange={(e) => setForm({ ...form, subCategoryNameEn: e.target.value })}
                        />
                    </div>
                    <div className="col-12 mb-2 lg:mb-2" dir={'ltr'}>
                        <label className={'mb-2 block'} htmlFor="male-image" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            {lang === 'ar' ? 'صورة الفئة الفرعية' : 'Sub Category Image'}
                        </label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setForm({ ...form, files });
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...form?.files || []];
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index;
                                });
                                // SET THE STATE
                                setForm({ ...form, files: newItems });
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={'card mb-2'} dir={lang === 'en' ? 'ltr' : 'rtl'}>
                <h1 className={'text-2xl font-bold mb-4 uppercase'}> {lang === 'en' ? 'Items' : 'العناصر'}</h1>
                <div className="grid formgrid p-fluid flex align-items-center">
                    {new Array(items?.itemsNumber).fill(0).map((_, index) => {
                        return (
                            <>
                                <div className="field col-12 md:col-5 " key={'item__name' + index}>
                                    <label htmlFor={`itemNameAR${index}`}>
                                        {lang === 'en' ? 'Item Name (AR)' : 'اسم العنصر (عربي)'}
                                    </label>
                                    <InputText
                                        id={`itemNameAR${index}`}
                                        placeholder={lang === 'en' ? 'Enter Item Name' : 'ادخل اسم العنصر'}
                                        onChange={(e) => {
                                            const ArrayOfItems = [...items.items];
                                            ArrayOfItems[index] = {
                                                ...ArrayOfItems[index],
                                                nameAR: e.target.value
                                            };

                                            setItems({
                                                ...items,
                                                items: ArrayOfItems
                                            });
                                        }}
                                        value={items.items[index]?.nameAR}
                                    />
                                </div>
                                <div className="field col-12 md:col-5">
                                    <label htmlFor={`itemNameEN${index}`}>
                                        {lang === 'en' ? 'Item Name (EN)' : 'اسم العنصر (انجليزي)'}
                                    </label>
                                    <InputText
                                        id={`itemNameEN${index}`}
                                        placeholder={lang === 'en' ? 'Enter Item English Name' : 'ادخل اسم العنصر بالانجليزية'}
                                        onChange={(e) => {
                                            const ArrayOfItems = [...items.items];
                                            ArrayOfItems[index] = {
                                                ...ArrayOfItems[index],
                                                nameEN: e.target.value
                                            };

                                            setItems({
                                                ...items,
                                                items: ArrayOfItems
                                            });
                                        }}
                                        value={items.items[index]?.nameEN}
                                    />
                                </div>
                                <div
                                    className="field col-12 md:col-2 flex justify-content-end align-items-end mb-8 mt-4 md:mt-0 md:mb-0">
                                    <Button
                                        icon="pi pi-times"
                                        price={'button'}
                                        rounded
                                        text
                                        raised
                                        severity="danger"
                                        aria-label="Cancel"
                                        type={'button'}
                                        onClick={() => {
                                            const ArrayOfItems = [...items.items];
                                            ArrayOfItems.splice(index, 1);
                                            setItems({
                                                ...items,
                                                itemsNumber: items.itemsNumber - 1,
                                                items: ArrayOfItems
                                            });
                                        }}
                                    />
                                </div>
                            </>);
                    })}
                </div>
                <div style={{
                    width: `100%`,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: '20px'
                }}>
                    <Button
                        icon="pi pi-plus"
                        price={'button'}
                        rounded
                        text
                        raised
                        severity="help"
                        aria-label="add"
                        type={'button'}
                        onClick={() => {
                            setItems({
                                ...items,
                                itemsNumber: items.itemsNumber + 1
                            });
                        }}
                    />
                </div>
            </div>
            <Button
                type={'submit'}
                className={'w-full'}
                label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                  style={{
                                                      width: '2rem',
                                                      height: '2rem'
                                                  }} /> : `${lang === 'ar' ? 'إنشاء الفئة الفرعية' : 'Create Sub Category'}`}
                disabled={loading} />
        </form>
    );
}