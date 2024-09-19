import React, { Component } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ItemDelete from './ItemDelete'
import axios from 'axios'; // axios as default

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false, // 편집 상태를 관리
      image : this.props.image,
      name: this.props.name,
      size: this.props.size,
      purchasePrice: this.props.purchasePrice,
      soldPrice: this.props.soldPrice,
      profitPerPerson: this.props.profitPerPerson,
      location : this.props.location || '일본',
      isSold: this.props.isSold,
      purchaseDate: this.props.purchaseDate,
      upadatedDate: this.props.upadatedDate,
      userName: this.props.userName,
    };
  }

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  handleSave = (e) => {
    e.preventDefault();
        this.updateItem()
            .then((response) => {
                console.log(response.data);
                this.props.stateRefresh();
                this.setState({ isEditing: false });
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
  };

  updateItem = () => {
    const url = '/api/items/update';
    const formData = new FormData();
    formData.append('id', this.props.id);
    formData.append('image', this.state.image);
    formData.append('name', this.state.name);
    formData.append('size', this.state.size);
    formData.append('purchasePrice', this.state.purchasePrice);
    formData.append('soldPrice', this.state.soldPrice);
    formData.append('profitPerPerson', this.state.profitPerPerson);
    formData.append('location', this.state.location);
    formData.append('isSold', this.state.isSold);
    formData.append('purchaseDate', this.state.purchaseDate);
    formData.append('userName', this.props.userName);

    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    

    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
    };
    return axios.post(url, formData, config);
};

  handleCancel = () => {
    this.setState({ isEditing: false });
    this.props.stateRefresh(); // 부모 컴포넌트의 상태를 새로고침
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { isEditing, name, purchasePrice, soldPrice, profitPerPerson, isSold, purchaseDate, location, size } = this.state;
    const {id, image} = this.props
    return (
      <TableRow>
        <TableCell>
          {isEditing ? (
            <div>
                <button onClick={this.handleSave}>Save</button>
                <button onClick={this.handleCancel}>cancel</button>
            </div>
          ) : (
            <button onClick={this.handleEdit}>Edit</button>
          )}
        </TableCell>
        <TableCell>
          <img src={this.props.image} alt={image} style={{ width: '50px' }} />
        </TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          ) : (
            name
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="text"
              name="size"
              value={size}
              onChange={this.handleChange}
            />
          ) : (
            size
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="text"
              name="purchasePrice"
              value={purchasePrice}
              onChange={this.handleChange}
            />
          ) : (
            purchasePrice
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="text"
              name="soldPrice"
              value={soldPrice}
              onChange={this.handleChange}
            />
          ) : (
            soldPrice
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="text"
              name="profitPerPerson"
              value={profitPerPerson}
              onChange={this.handleChange}
            />
          ) : (
            profitPerPerson
          )}
        </TableCell>
        <TableCell>
          {/* 재고 장소 풀다운 메뉴 */}
          {isEditing ? (
            <select
              name="location"
              value={location}
              onChange={this.handleChange}
            >
              <option value="한국">한국</option>
              <option value="일본">일본</option>
            </select>
          ) : (
            location
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <select name="isSold" value={isSold} onChange={this.handleChange}>
              <option value={true}>Sold</option>
              <option value={false}>Not Sold</option>
            </select>
          ) : (
            isSold ? 'Sold' : 'Not Sold'
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <input
              type="text"
              name="purchaseDate"
              value={purchaseDate}
              onChange={this.handleChange}
            />
          ) : (
            purchaseDate
          )}
        </TableCell>
        <TableCell>
            <ItemDelete id={id} stateRefresh={this.props.stateRefresh} />
        </TableCell>
      </TableRow>
    );
  }
}

export default Item;
