import React from 'react';

class ItemDelete extends React.Component {
  deleteItem = (id) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    
    if (!confirmDelete) {
      return;
    }

    const url = '/api/items/' + id;
    console.log("url" + url);

    fetch(url, {
      method: 'DELETE',
    })
    .then(() => this.props.stateRefresh())
    .catch((err) => console.log(err));
  };

  render() {
    return (
      <button
        variant="contained"
        color="secondary"
        onClick={(e) => this.deleteItem(this.props.id)}
      >
        삭제
      </button>
    );
  }
}

export default ItemDelete;
