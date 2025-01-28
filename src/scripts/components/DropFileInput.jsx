import React, {useRef, useState} from 'react';
import {__} from '@wordpress/i18n';
import PropTypes from 'prop-types';
import apiFetch from '@wordpress/api-fetch';
import {useEffect} from "@wordpress/element";

const DropFileInput = props => {
    const wrapperRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [logo, setLogo] = useState(props?.logo);
    const [className, setClassName] = useState('bg-cultured');
    const [uploading, setUploading] = useState(false);
    const [disabled, setDisabled] = useState(props?.disabled ?? false)

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    useEffect(() => {
        if(props?.logo) {
            setLogo(props?.logo);
            setClassName('bg-white');
        }
    }, [props])

    const onFileDrop = async (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [newFile];
            setFileList(updatedList);
            setLogo(URL.createObjectURL(newFile));
            setClassName('bg-white');
            props.onFileChange(updatedList);
            const isImage = newFile.type.startsWith('image/');
            if (isImage) {
                setUploading(true);

                const formData = new FormData();
                formData.append('file', newFile);

                apiFetch({
                    path: `wp/v2/media`,
                    method: 'POST',
                    body: formData
                }).then((response) => {
                    setLogo(response.source_url);
                    setClassName('bg-white');
                    setFileList([newFile]);
                    props.onFileChange(response);
                })
                .catch(error => {
                    console.error('Error uploading the file:', error);
                })
                .finally(() => {
                    setUploading(false)
                })
            } else {
                alert(__('Please upload a valid image file', 'app'));
            }
        }
    }

    const fileRemove = (event) => {
        event.preventDefault();
        const updatedList = [];
        setLogo('');
        setClassName('bg-cultured')
        props.onFileChange(updatedList);
    }

    return (
        <>
            <div
                ref={wrapperRef}
                className='drop-file-input p-relative'
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className='drop-file-input__label'>
                    <div className={`logo w-200 h-100 ${className} p-relative text-grey-40 flex justify-center items-center b-grey-10-1 rounded radius-sm p-0`}
                         style={{'overflow': 'hidden'}}>
                        {logo ? (
                            <div>
                                <a href='#' onClick={fileRemove} className='close p-absolute top right'>&times;</a>
                                <img alt={__('Invoice logo', 'app')} src={logo} className='w-100-p h-auto object-cover'/>
                            </div>
                        ) : (
                            __('Add your logo', 'app')
                        )}
                    </div>
                </div>
                {logo && !disabled && <input type='file'
                       value=''
                       className='w-150 h-100 p-absolute top center'
                       style={{'opacity': '0'}}
                       onChange={onFileDrop}/>}
            </div>
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
