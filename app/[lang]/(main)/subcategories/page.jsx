import SubCategoriesList from '../components/subCategories/subCategoriesList/subCategoriesList';

export default function SubCategoriesPage({params: {lang}}) {

    return (
        <div className={'card mb-0'}>
            <SubCategoriesList lang={lang} />
        </div>
    );
}