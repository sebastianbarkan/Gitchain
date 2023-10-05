
export const categoryOptions = [
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'fullstack', label: 'Full Stack Development' },
    { value: 'mobile', label: 'Mobile App Development' },
    { value: 'devops', label: 'DevOps' },
    { value: 'uiux', label: 'UI/UX Design' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'database', label: 'Database Administration' },
    { value: 'testing', label: 'Software Testing' },
    { value: 'systems', label: 'Systems Programming' },
    { value: 'embedded', label: 'Embedded Systems' },
    { value: 'gamedev', label: 'Game Development' },
    { value: 'datascience', label: 'Data Science' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'web3', label: 'Web3 & Blockchain' },
    { value: 'networking', label: 'Networking' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'os', label: 'Operating Systems' },
    { value: 'vrar', label: 'Virtual & Augmented Reality' },
    { value: 'iot', label: 'Internet of Things (IoT)' },
    { value: 'graphics', label: 'Graphics Programming' },
    { value: 'multimedia', label: 'Multimedia Applications' },
]

export const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'cplus', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'golang', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'scala', label: 'Scala' },
    { value: 'r', label: 'R' },
    { value: 'shell', label: 'Shell' },
    { value: 'dart', label: 'Dart' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'lua', label: 'Lua' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'perl', label: 'Perl' },
    { value: 'coffeescript', label: 'CoffeeScript' },
    { value: 'vba', label: 'VBA' },
    { value: 'objective-c', label: 'Objective-C' },
    { value: 'groovy', label: 'Groovy' },
    { value: 'sql', label: 'SQL' },
    { value: 'pascal', label: 'Pascal' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'fortran', label: 'Fortran' },
    { value: 'cobol', label: 'COBOL' },
    { value: 'fsharp', label: 'F#' },
    { value: 'apl', label: 'APL' },
    { value: 'julia', label: 'Julia' },
    { value: 'solidity', label: 'Solidity' }, // Web3 specific
    { value: 'vyper', label: 'Vyper' },       // Web3 specific
    { value: 'chaincode', label: 'Chaincode' }, // Hyperledger Fabric Smart Contract language
    { value: 'simula', label: 'Simula' },
    { value: 'ada', label: 'Ada' },
    { value: 'd', label: 'D' },
    { value: 'abap', label: 'ABAP' },
    { value: 'sass', label: 'Sass' },
    { value: 'less', label: 'Less' },
    { value: 'prolog', label: 'Prolog' },
    { value: 'vhdl', label: 'VHDL' },
    { value: 'elm', label: 'Elm' },
    { value: 'scheme', label: 'Scheme' },
    { value: 'clojure', label: 'Clojure' },
    { value: 'erlang', label: 'Erlang' },
    { value: 'webassembly', label: 'WebAssembly' },
    { value: 'assembly', label: 'Assembly' }
];

export const customStylesCategory = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#3A3C43',
        borderRadius: '12px',
        cursor: "pointer",
        paddingLeft: '8px',
        borderColor: state.isFocused ? '#676767' : '#3A3C43',
        boxShadow: state.isFocused ? '0 0 0 1px #676767' : null, // Override the blue border
        '&:hover': {
            borderColor: '#676767'
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#24262E',
        borderRadius: '12px',
        cursor: "pointer",
    }),
    option: (base, state) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
        backgroundColor: state.isSelected ? '#3A3C43' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : null
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#3A3C43',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    multiValueRemove: (base, state) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white'
        }
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    input: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: 'none'
    }),
    indicatorsContainer: (base) => ({
        ...base,
        justifyContent: 'flex-start'
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        paddingLeft: '12px',  // Adjust padding as needed
        paddingRight: '12px',
        color: state.isFocused ? 'rgba(255, 255, 255, 0.782)' : 'rgba(255, 255, 255, 0.5)',
    }),
    clearIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? 'rgba(255, 255, 255, 0.782)' : 'rgba(255, 255, 255, 0.5)',
    }),
};

export const customStylesLanguages = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#3A3C43',
        borderRadius: '12px',
        cursor: "pointer",
        paddingLeft: '8px',
        borderColor: state.isFocused ? '#676767' : '#3A3C43',
        boxShadow: state.isFocused ? '0 0 0 1px #676767' : null, // Override the blue border
        '&:hover': {
            borderColor: '#676767'
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#24262E',
        borderRadius: '12px',
        cursor: "pointer",
    }),
    option: (base, state) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
        backgroundColor: state.isSelected ? '#3A3C43' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : null
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#3A3C43',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    multiValueRemove: (base, state) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white'
        }
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    input: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.782)',
        cursor: "pointer",
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: 'none'
    }),
    indicatorsContainer: (base) => ({
        ...base,
        justifyContent: 'flex-start'
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        paddingLeft: '12px',  // Adjust padding as needed
        paddingRight: '12px',
        color: state.isFocused ? 'rgba(255, 255, 255, 0.782)' : 'rgba(255, 255, 255, 0.5)',
    }),
    clearIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? 'rgba(255, 255, 255, 0.782)' : 'rgba(255, 255, 255, 0.5)',
    }),
};