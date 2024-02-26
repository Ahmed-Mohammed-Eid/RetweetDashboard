// COMPONENTS
import EditSubCategory from '../../components/subCategories/EditSubCategory/EditSubCategory';


export default async function EditSubCategoryPage({params}) {
    // DYNAMIC ROUTE
    const { id, lang } = params

    return (
        <EditSubCategory subCategoryId={id} lang={lang} />
    );
}