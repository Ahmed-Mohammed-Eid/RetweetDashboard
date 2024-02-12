// COMPONENTS
import EditSubCategory from '../../components/subCategories/EditSubCategory/EditSubCategory';


export default async function EditSubCategoryPage({params}) {
    // DYNAMIC ROUTE
    const { id } = params

    return (
        <EditSubCategory subCategoryId={id} />
    );
}