import React from 'react';

class AdvertiserTableHeaderCollumnComponent extends React.Component {
    constructor(props) {
      super(props);

    }

    render(){
        const { collumnName, displayName, sort, handleClick } = this.props;         
        return (<th onClick={() => handleClick(collumnName)}>{displayName}{this.createSortArrow(collumnName, sort)}</th>); 
    }

    createSortArrow(collumnName, sort)
    {
      if(sort)
      {
        if(collumnName === sort.orderBy)
        {
          let icon;
          if(sort.order === "asc")
          {
            icon = "^";
          }
          else
          {
            icon = "v";
          }          
          return <span className="orderIcon">{icon}</span>;
        }
      }
      return;
    }

}

export default AdvertiserTableHeaderCollumnComponent;