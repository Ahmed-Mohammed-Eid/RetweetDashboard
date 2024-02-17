// COMPONENTS
import EditCategory from '../../components/Categories/EditCategory/EditCategory';


export default async function EditCategoryPage({params}) {
    // DYNAMIC ROUTE
    const { id } = params

    return (
        <EditCategory categoryId={id} />
    );
}