import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from "./CreateTask.module.css";
import Select, { components } from 'react-select';
import { customStylesCategory, customStylesLanguages, languageOptions, categoryOptions } from '../../utils/ReactSelect';
import { createTask } from '../../redux/slices/TaskSlice';


const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.293 6.293L8 11L12.707 6.293L14.414 8L8 14.414L1.58579 8L3.29289 6.293L3.293 6.293Z" fill="rgba(255, 255, 255, 0.782)" />
    </svg>
);

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <ChevronDown />
        </components.DropdownIndicator>
    );
};

const IndicatorSeparator = () => null;  // Remove the separator completely

function CreateTask() {
    const dispatch = useDispatch()
    const address = useSelector(state => state.auth.address)
    const [level, setLevel] = useState("")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [signerLevel, setSignerLevel] = useState("")
    const [githubRepo, setGithubRepo] = useState("")
    const [category, setCategory] = useState("")
    const [languages, setLanguages] = useState([])
    const [formWarning, setFormWarning] = useState(false)
    
    const formValues = {
        level,
        amount,
        description,
        signerLevel,
        githubRepo,
        category,
        languages
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        for (const key in formValues) {
            if (formValues[key] === null || formValues[key] === "" || formValues[key] === 0) {
                setFormWarning(true);
                return;
            }
        }
    
        if (languages.length === 0) {
            setFormWarning(true);
            return;
        }
    
        const submitForm = async () => {
            try {
                const resultAction = await dispatch(createTask({taskLevel: level, signerLevel, bountyAmount: amount, githubRepo, category, description, languages}));
                if (createTask.fulfilled.match(resultAction)) {
                    setAmount("")
                    setLevel("")
                    setDescription("")
                    setSignerLevel("")
                    setGithubRepo("")
                    setCategory("")
                    setLanguages([])
                } else {
                    console.log('Failed to create the task');
                    // handle failure logic here
                }
            } catch (err) {
                console.error("Error submitting the form:", err);
                throw err
            }
        }
    
        submitForm();
    }

    return (
        <section className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles["img-background"]}></div>
                <h1 className={styles.heading}>Create a task</h1>
                <div className={styles["input-wrap"]}>
                    <label
                        htmlFor='level'
                        className={styles.label}
                    >
                        Level
                    </label>
                    <input
                        type="number"
                        value={level}
                        onChange={(e) => {
                            setLevel(e.target.value)
                        }}
                        placeholder="1"
                        name='level'
                        id='level'
                        className={styles.input}
                    />
                </div>
                <div className={styles["input-wrap"]}>
                    <label
                        htmlFor='amount'
                        className={styles.label}
                    >
                        Amount (TRX)
                    </label>
                    <input
                        type="number"
                        name='amount'
                        id='amount'
                        value={amount}
                        min={15}
                        onChange={(e) => {
                            setAmount(e.target.value)
                        }}
                        className={styles.input}
                    />
                </div>
                <div className={styles["input-wrap"]}>
                    <label
                        htmlFor='description'
                        className={styles.label}
                    >
                        Description
                    </label>
                    <textarea
                        type="text"
                        name='description'
                        id='description'
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                        placeholder="Write a detailed description..."
                        className={styles.input}
                    />
                </div>
                <div className={styles["input-wrap"]}>
                    <label
                        htmlFor='signerlevel'
                        className={styles.label}
                    >
                        Signer Level
                    </label>
                    <input
                        type="number"
                        placeholder="2"
                        value={signerLevel}
                        onChange={(e) => {
                            setSignerLevel(e.target.value)
                        }}
                        name='signerlevel'
                        id='signerlevel'
                        className={styles.input}
                    />
                </div>
                <div className={styles["input-wrap"]}>
                    <label
                        htmlFor='githubRepo'
                        className={styles.label}
                    >
                        Github Repository
                    </label>
                    <input
                        type="text"
                        placeholder="https://github.com/sebastianbarkan/Gitchain"
                        name='githubRepo'
                        value={githubRepo}
                        onChange={(e) => {
                            console.log("ETARGET", e.target.value)
                            setGithubRepo(e.target.value)
                        }}
                        id='githubRepo'
                        className={styles.input}
                    />
                </div>
                <div className={styles["input-wrap-top-select"]}>
                    <label
                        htmlFor='category'
                        className={styles.label}
                    >
                        Category
                    </label>
                    <Select
                        isMulti={false}
                        isSearchable
                        styles={customStylesCategory}
                        options={categoryOptions}
                        onChange={(option) => {
                            setCategory(option.value)
                        }}
                        components={{
                            DropdownIndicator,
                            IndicatorSeparator
                        }}
                    />
                </div>
                <div className={styles["input-wrap-bottom-select"]}>
                    <label
                        htmlFor='category'
                        className={styles.label}
                    >
                        Languages
                    </label>
                    <Select
                        isMulti
                        isSearchable
                        styles={customStylesLanguages}
                        options={languageOptions}
                        onChange={(options) => {
                            setLanguages(options || [])
                        }}
                        components={{
                            DropdownIndicator,
                            IndicatorSeparator
                        }}
                    />
                </div>
                <button className={styles.btn} type='submit'>Submit</button>
            </form>
        </section>
    )
}

export default CreateTask