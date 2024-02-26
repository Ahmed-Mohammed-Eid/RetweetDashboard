import CreateItemForm from '../../components/Items/CreateItemForm/CreateItemForm';

export default function CreateItemPage({params: {lang}}) {
  return (
    <div>
      <CreateItemForm lang={lang} />
    </div>
  );
}