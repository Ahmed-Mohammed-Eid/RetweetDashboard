import CategoriesList from '../components/Categories/CategoriesList/CategoriesList';

export default function Categories({params: {lang}}) {
    return (
        <div className={'card mb-0'}>
            <CategoriesList lang={lang} />
        </div>
    );
}