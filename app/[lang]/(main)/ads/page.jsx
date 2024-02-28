import AdsList from '../components/Ads/AdsList/AdsList';

export default function Ads({params: {lang}}) {
    return (
        <AdsList lang={lang} />
    );
}