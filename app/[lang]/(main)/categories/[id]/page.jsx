// COMPONENTS
import EditCategory from '../../components/Categories/EditCategory/EditCategory';


export default async function EditCategoryPage({params}) {
    // DYNAMIC ROUTE
    const { id, lang } = params;

    return (
        <EditCategory categoryId={id} lang={lang} />
    );
}