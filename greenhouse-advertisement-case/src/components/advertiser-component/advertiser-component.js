import React from 'react';
import QueryString from 'query-string';
import './advertiser-component.css';
import AdvertiserTableBodyComponent from '../advertiser-table-body-component/advertiser-table-body-component';

class AdvertiserComponent extends React.Component {
  constructor(props) {
    super(props);
    
    let sort = { order: "", orderBy: "" };

    if(this.props.location.search)
    {
      const parsedQueryString = QueryString.parse(this.props.location.search);
      sort = {orderBy: parsedQueryString.orderBy, order: parsedQueryString.order};      
    }    

    this.state = {      
      items: [],
      isAdvertisersLoading: false,
      isAdvertisersError: false,
      sort: sort
    };
  }

  componentDidMount() {   
    this.loadAdvertisers();       
  }

  loadAdvertisers()
  {
    this.setState({      
      isAdvertisersLoading: true,       
    });
    fetch("https://5b87a97d35589600143c1424.mockapi.io/api/v1/advertisers")
      .then(res => res.json())
      .then(
        (result) => {                   
          if(Array.isArray(result))
          {
            let advertisers = [];
            result.forEach(function(item){              
              advertisers.push(
                {
                  id: item.id,
                  name: item.name,
                  createdAt: item.createdAt,
                  campaigns: item.campaignIds.length
                }
              )
            });

            this.setState({            
              items: advertisers,
              isAdvertisersLoading: false,              
            });
            this.loadAdvertiserStatistics();
          }
          else
          {
            console.error(result);
            this.setState({                          
              isAdvertisersLoading: false,
              isAdvertisersError: true
            }); 
          }
        },
        (error) => {    
          console.error(error);      
          this.setState({                        
            isAdvertisersLoading: false,
            isAdvertisersError: true
          });          
        }
      )
  }

  loadAdvertiserStatistics()
  {
    fetch("https://5b87a97d35589600143c1424.mockapi.io/api/v1/advertiser-statistics")
      .then(res => res.json())
      .then(
        (result) => {                   
          if(Array.isArray(result))
          {                        
            this.setState({            
              items: this.enrichAdvertisersWithStatistics(this.state.items, result),
            });          
          }
          else
          {
            console.error(result);
          }
        },
        (error) => {          
          console.error(error);
        }
      )
  }

  enrichAdvertisersWithStatistics(items, statistics)
  {
      items.forEach(function(item){
          let statistic = statistics.find(x=>x.advertiserId === item.id);          
          if(statistic)
          {
            item.clicks = statistic.clicks;
            item.impressions = statistic.impressions;
          }
      });

      return items;
  }


    render() {
      const { items, isAdvertisersLoading, isAdvertisersError, sort } = this.state;         
 
      return (            
        <div className="content">
          <h1>Overview of Advertisers</h1>
          <table>
            <thead>
              <tr>
                {this.createCollumnHeader("name", "Advertiser", sort)}
                {this.createCollumnHeader("createdAt", "Creation date", sort)}
                {this.createCollumnHeader("campaigns", "# campaigns", sort)}
                {this.createCollumnHeader("impressions", "Impressions", sort)}
                {this.createCollumnHeader("clicks", "Clicks", sort)}
              </tr>
            </thead>
            <tbody>
              <AdvertiserTableBodyComponent 
                data={items} 
                isisAdvertisersLoading={isAdvertisersLoading}  
                isAdvertisersError={isAdvertisersError}
                sort={sort}>
                </AdvertiserTableBodyComponent>
            </tbody>
          </table>
        </div>
        );
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

    createCollumnHeader(collumnName, displayName, sort)
    {
      return (<th onClick={() => this.handleClick(collumnName)}>{displayName}{this.createSortArrow(collumnName, sort)}</th>);  
    }

    handleClick(collumn)
    {      
      let sort;    
      if(this.state.sort.orderBy === collumn)
      {          
          sort = { 
            orderBy: this.state.sort.orderBy,
            order: this.state.sort.order === "asc" ? "desc" : "asc"
          };            
      }
      else
      {        
        sort = { 
          orderBy: collumn,
          order: this.state.sort.order ? this.state.sort.order : "desc"
        };               
      }

      this.props.history.push({
        pathname: '/',
        search: "?" + new URLSearchParams(sort).toString()});              
      
      this.setState({
        sort: sort 
      });
    }
  }

  export default AdvertiserComponent;