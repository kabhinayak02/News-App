import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
 
export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 20, 
        category: 'general'        
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number, 
        category: PropTypes.string,
    }
  capitalizeFirstLetter = (string) =>{
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props){
    super(props);
    this.state = {
      articles: [],
      loading:false,
      page:1,
      totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - By NewsNow`
  }


  async updateNews(){
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true});
    let data = await fetch(url);
    let parsedData = await data.json()
    this.setState({articles: parsedData.articles, 
        totalResults: parsedData.totalResults,
        loading: false
    })
  }

  async componentDidMount(){
    this.updateNews();
  }

  handleNextClick = async ()=>{
    this.setState({page: this.state.page + 1});
    this.updateNews();
  }

  handlePrevClick = async ()=>{
    this.setState({page: this.state.page - 1});
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({page: this.state.page + 1});
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    // console.log(parsedData);  
    this.setState({
        articles: this.state.articles.concat(parsedData.articles), 
        totalResults: parsedData.totalResults
    })
  };

  render() {
    return (
      <>
        <h2 className="text-center" style={{margin: '35px 0px'}}>NewsNow - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner/>}
          
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner/>}
          >
            <div className="container">
              <div className="row">
              {this.state.articles.map((element)=>{
                return <div className="col-md-3" key={element.url}>
                <NewsItem  title={element.title?element.title:""} description={element.description?element.description.slice(0,88):" "}
                imageUrl={element.urlToImage} newsUrl={element.url} date={element.publishedAt} author={element.author?element.author:"Unknown"}/>
              </div>
              })}  
              </div>
            </div>
          </InfiniteScroll>
      </>
    )  
  }
}

export default News 