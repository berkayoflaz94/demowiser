import React from 'react';
import Select from 'react-select';

interface Item {
    _id: string;
    name: string;
}

interface Props {
    list: Item[];
    selectedItem: any;
    placeholder: string;
    setSelectedItem: (value: string) => void;
}

const SearchableSelect: React.FC<Props> = ({
   list,
   selectedItem,
   placeholder,
   setSelectedItem,
}) => {
    // Check if list is empty
    if (!list) return null;

    // React-Select için seçenekleri hazırla
    const options = list.map((item) => ({
        value: item._id,
        label: item.name,
    }));

    // Seçenek değiştiğinde çağrılacak fonksiyon
    const handleChange = (selectedOption: { value: string; label: string } | null) => {
        setSelectedItem(selectedOption ? selectedOption.value : '');
    };

    return (
        <Select
            className="basic-single"
            classNamePrefix="select"
            value={options.find((option) => option.value === selectedItem || option.value === selectedItem?._id) || null} // Değeri bulunamıyorsa null döndür
            onChange={handleChange}
            options={options}
            placeholder={placeholder}
        />
    );
};

export default SearchableSelect;
