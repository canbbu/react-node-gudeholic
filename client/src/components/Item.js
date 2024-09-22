import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ItemDelete from './ItemDelete';
import axios from 'axios';

function Item({ id, userName, stateRefresh, ...props }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: props.image,
    name: props.name,
    size: props.size,
    purchasePrice: props.purchasePrice,
    soldPrice: props.soldPrice,
    profitPerPerson: props.profitPerPerson,
    location: props.location || '일본',
    isSold: props.isSold,
    purchaseDate: props.purchaseDate,
  });

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    stateRefresh();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await updateItem();
      console.log(response.data);
      stateRefresh();
      setIsEditing(false);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const updateItem = () => {
    const url = '/api/items/update';
    const formDataToSend = new FormData();
    Object.entries({ ...formData, id, userName }).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    const config = { headers: { 'content-type': 'multipart/form-data' } };
    return axios.post(url, formDataToSend, config);
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleEdit}>Edit</button>
        )}
      </TableCell>
      <TableCell>
        <img src={formData.image} alt={formData.name} style={{ width: '50px' }} />
      </TableCell>
      {['name', 'size', 'purchasePrice', 'soldPrice', 'profitPerPerson', 'purchaseDate'].map((field) => (
        <TableCell key={field}>
          {isEditing ? (
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          ) : (
            formData[field]
          )}
        </TableCell>
      ))}
      <TableCell>
        {isEditing ? (
          <select name="location" value={formData.location} onChange={handleChange}>
            <option value="한국">한국</option>
            <option value="일본">일본</option>
          </select>
        ) : (
          formData.location
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <select name="isSold" value={formData.isSold} onChange={handleChange}>
            <option value={true}>Sold</option>
            <option value={false}>Not Sold</option>
          </select>
        ) : (
          formData.isSold ? 'Sold' : 'Not Sold'
        )}
      </TableCell>
      <TableCell>
        <ItemDelete id={id} stateRefresh={stateRefresh} />
      </TableCell>
    </TableRow>
  );
}

export default Item;
