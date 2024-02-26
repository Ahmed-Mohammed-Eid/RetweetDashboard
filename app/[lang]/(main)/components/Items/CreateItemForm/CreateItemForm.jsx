'use client';

import { useState, useEffect } from 'react';

// IMPORTS
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CreateItemForm({ lang }) {

    // STATES
    const [loading, setLoading] = useState(false);
    const [categoriesData, setCategoriesData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [subCategories, setSubCategories] = useState(null);
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [items, setItems] = useState({
        itemsNumber: 0,
        items: []
    });

    // EFFECT TO GET THE CATEGORIES AND SUBCATEGORIES
    useEffect(() => {
        // GET CATEGORIES
        axios.get(`${process.env.API_URL}/categories`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                // SET THW CATEGORIES DATA
                setCategoriesData(res.data?.categories);
                // LOOP THROUGH THE CATEGORIES AND MAKE AN ARRAY OF OBJECTS {LABEL: LANG === 'AR' ? CATEGORYNAME : CATEGORYNAMEEN, VALUE: _ID}
                const categoriesArray = res.data?.categories.map(category => {
                    return {
                        label: lang === 'ar' ? category.categoryName : category.categoryNameEn,
                        value: category._id
                    };
                });
                // SET THE CATEGORIES
                setCategories(categoriesArray);
            })
            .catch(err => {
                console.log(err);
            });
        // GET SUBCATEGORIES
    }, [lang]);

    // EFFECT TO SET THE SUBCATEGORIES WHEN THE CATEGORY CHANGES
    useEffect(() => {
        if (category) {
            // GET THE CATEGORY OBJECT FROM THE CATEGORIES DATA
            const categoryObject = categoriesData.find(cat => cat._id === category);
            // SET THE SUBCATEGORIES
            const subCategoriesArray = categoryObject.subCategories.map(subCategory => {
                return {
                    label: lang === 'ar' ? subCategory.subCategoryName : subCategory.subCategoryNameEn,
                    value: subCategory._id
                };
            });
            
            setSubCategories(subCategoriesArray);
        }
    }, [categoriesData, category, lang]);


    // CREATE ITEM HANDLER
    function createItemsHandler(e) {
        e.preventDefault();
        // VALIDATIONS
        if (!category || !subCategory || items.items.length === 0) {
            return toast.error(lang === 'en' ? 'Please fill all the fields' : 'من فضلك املأ جميع الحقول');
        }

        // CHECK THAT THE ITEMS ARRAY OBJECTS HAVE THE SAME LENGTH AS THE ITEMS NUMBER AND EVERY OBJECT HAS A NAME IN ARABIC AND ENGLISH AND THERE IS NO EMPTY STRINGS
        if (items.items.length !== items.itemsNumber || items.items.some(item => !item.nameAR || !item.nameEN || item.nameAR === '' || item.nameEN === '')) {
            return toast.error(lang === 'en' ? 'Please fill all the fields' : 'من فضلك املأ جميع الحقول');
        }

        // SET LOADING TO TRUE
        setLoading(true);

        // CREATE 2 ARRAYS OF ITEMS NAMES IN ARABIC AND ENGLISH
        const itemsAr = items.items.map(item => item.nameAR);
        const itemsEn = items.items.map(item => item.nameEN);

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/add/items`, {
            subCategoryId: subCategory,
            items: itemsAr,
            itemsEn: itemsEn
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                // SET LOADING TO FALSE
                setLoading(false);
                // TOAST THE SUCCESS MESSAGE
                toast.success(lang === 'en' ? 'Item Created Successfully' : 'تم انشاء العنصر بنجاح');
            })
            .catch(err => {
                // SET LOADING TO FALSE
                setLoading(false);
                // TOAST THE ERROR MESSAGE
                toast.error(lang === 'en' ? 'Something went wrong' : 'حدث خطأ ما');
            });
    }

    return (
        <form onSubmit={createItemsHandler}>
            <div className={'card mb-2'} dir={lang === 'en' ? 'ltr' : 'rtl'}>
                <h1 className={'text-2xl font-bold mb-4 uppercase'}>
                    {lang === 'en' ? 'Create Item' : 'إنشاء عنصر'}
                </h1>
                <div className="grid formgrid p-fluid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="category">{lang === 'en' ? 'Category' : 'القسم'}</label>
                        <Dropdown
                            id="category"
                            optionLabel="label"
                            optionValue="value"
                            placeholder={lang === 'en' ? 'Select a Category' : 'اختر قسم'}
                            value={category}
                            options={categories || []}
                            onChange={(e) => setCategory(e.value)}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name">{lang === 'en' ? 'Sub Category' : 'القسم الفرعي'}</label>
                        <Dropdown
                            id="subCategory"
                            optionLabel="label"
                            optionValue="value"
                            placeholder={lang === 'en' ? 'Select a Sub Category' : 'اختر قسم فرعي'}
                            value={subCategory}
                            options={subCategories || []}
                            onChange={(e) => setSubCategory(e.value)}
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
                style={{ width: '100%' }}
                label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                  style={{
                                                      width: '2rem',
                                                      height: '2rem'
                                                  }} /> : `${lang === 'en' ? 'Create' : 'إنشاء'}`}
                disabled={loading} />
        </form>
    );
}