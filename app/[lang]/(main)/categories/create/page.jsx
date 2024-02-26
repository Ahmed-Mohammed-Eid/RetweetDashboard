import CreateCategory from '../../components/Categories/CreateCategory/CreateCategory';

export default function CreateCategoryPage({params: {lang}}) {
    return (
        <CreateCategory lang={lang} />
    );
}