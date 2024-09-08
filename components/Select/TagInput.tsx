import React from 'react';
import CreatableSelect from 'react-select/creatable';

interface TagInputProps {
    keywords: string[];
    changeValue: (newKeywords: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ keywords, changeValue }) => {
    const handleChange = (newValue: any) => {
        const newKeywords = newValue ? newValue.map((option: any) => option.value) : [];
        changeValue(newKeywords);
    };

    return (
        <CreatableSelect
            isMulti
            value={keywords.map(keyword => ({ value: keyword, label: keyword }))}
            onChange={handleChange}
            placeholder="Enter Keywords"
            className="basic-multi-select"
            classNamePrefix="select"
        />
    );
};

export default TagInput;
