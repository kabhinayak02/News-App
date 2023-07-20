import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
 
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
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true});
    let data = await fetch(url);
    let parsedData = await data.json()
    // console.log(parsedData);  
    this.setState({articles: parsedData.articles, 
        totalResults: parsedData.totalResults,
        loading: false
    })
  }

  async componentDidMount(){
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=1&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true});
    // let data = await fetch(url);
    // let parsedData = await data.json()
    // console.log(parsedData);  
    // this.setState({articles: parsedData.articles, 
    //     totalResults: parsedData.totalResults,
    //     loading: false
    // })
    this.updateNews();
  }

  handleNextClick = async ()=>{
    // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults/ this.props.pageSize))){
    //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    //     this.setState({loading: true});
    //     let data = await fetch(url);
    //     let parsedData = await data.json()
    //     this.setState({
    //         page: this.state.page + 1,
    //         articles: parsedData.articles,
    //         loading: false
    //     })
    // }
    this.setState({page: this.state.page + 1});
    this.updateNews();
  }

  handlePrevClick = async ()=>{
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true});
    // let data = await fetch(url);
    // let parsedData = await data.json()
    // console.log(parsedData);  
    // this.setState({
    //     page: this.state.page - 1,
    //     articles: parsedData.articles,
    //     loading: false
    // })
    this.setState({page: this.state.page - 1});
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({page: this.state.page + 1});
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1396ab93a6374d639287d23055b9fddd&page=${this.state.page}&pageSize=${this.props.pageSize}`;
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
      <div className="container my-3">
        <h2 className="text-center" style={{margin: '35px 0px'}}>NewsNow - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner/>}
          
          <div className="row">
          {!this.state.loading && this.state.articles.map((element)=>{
            return <div className="col-md-3" key={element.url}>
            <NewsItem  title={element.title?element.title:""} description={element.description?element.description.slice(0,88):" "}
            imageUrl={element.urlToImage} newsUrl={element.url} date={element.publishedAt} author={element.author?element.author:"Unknown"}/>
          </div>
          })}  
          </div>

        <div className="container d-flex justify-content-between">
            <button disabled={this.state.page<=1}type="button" className="btn btn-primary" onClick={this.handlePrevClick}>&larr; Previous</button>
            <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-primary" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )  
  }
}

export default News 