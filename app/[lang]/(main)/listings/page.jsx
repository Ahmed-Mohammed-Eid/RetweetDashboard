import ListingsList from '../components/Listings/ListingsTable/ListingsTable';

export default function Categories({params: {lang}}) {
    return (
        <div className={'card mb-0'}>
            <ListingsList lang={lang} />
        </div>
    );
}