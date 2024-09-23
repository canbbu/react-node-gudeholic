import React from 'react';

const ItemDelete = ({ id, stateRefresh }) => {
  const deleteItem = () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    
    if (!confirmDelete) {
      return;
    }

    const url = `/api/items/${id}`;
    console.log("url: " + url);

    fetch(url, {
      method: 'DELETE',
    })
      .then(() => stateRefresh())
      .catch((err) => console.log(err));
      window.location.reload();
  };

  return (
    <button
      variant="contained"
      color="secondary"
      onClick={deleteItem}
    >
      삭제
    </button>
  );
};

export default ItemDelete;
