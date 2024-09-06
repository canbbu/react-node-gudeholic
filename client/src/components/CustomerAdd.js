import React from 'react';
import axios from 'axios'; // axios를 default로 가져오기

class CustomerAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            userName: '',
            birthday: '',
            gender: '',
            job: '',
            fileName: '',
        };
    }

    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        });
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleFormSubmit = (e) => {
        e.preventDefault(); // 오타 수정 (preventDefualt -> preventDefault)
        this.addCustomer()
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        })

        this.setState({
            file: null,
            userName : '',
            birthday : '',
            gender : '',
            job : '',
            fileName : '',
        })
        //window.location.reload()
    }

    addCustomer = () => {
        const url = '/api/customers';
        const formData = new FormData();
        formData.append('image', this.state.file);
        formData.append('name', this.state.userName);
        formData.append('birthday', this.state.birthday);
        formData.append('gender', this.state.gender);
        formData.append('job', this.state.job); // job 추가
        formData.append('fileName', this.state.fileName);

        // 파일의 형식을 보낼 때는 header에 multipart를 붙여야 합니다.
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return axios.post(url, formData, config); // post 대신 axios.post 사용
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <h1>고객 추가</h1>
                프로필 이미지: 
                <input 
                    type="file" 
                    name="file" 
                    onChange={this.handleFileChange} 
                /> <br/>
                이름: 
                <input 
                    type="text" 
                    name="userName" 
                    value={this.state.userName} 
                    onChange={this.handleValueChange} 
                /> <br/>
                생년월일: 
                <input 
                    type="text" 
                    name="birthday" 
                    value={this.state.birthday} 
                    onChange={this.handleValueChange} 
                /> <br/>
                성별: 
                <input 
                    type="text" 
                    name="gender" 
                    value={this.state.gender} 
                    onChange={this.handleValueChange} 
                /> <br/>
                직업: 
                <input 
                    type="text" 
                    name="job" 
                    value={this.state.job} 
                    onChange={this.handleValueChange} 
                /> <br/>
                <button type="submit">추가하기</button>
            </form>
        );
    }
}

export default CustomerAdd;
