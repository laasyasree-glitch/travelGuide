import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Card from './Card'
import './App.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    list: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTravelsList()
  }

  getTravelsList = async () => {
    const apiUrl = 'https://apis.ccbp.in/tg/packages'
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const res = await fetch(apiUrl)
    if (res.ok) {
      const fetchedData = await res.json()
      const updatedData = fetchedData.packages.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
        description: each.description,
      }))
      this.setState({
        list: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCardsView = () => {
    const {list} = this.state
    return (
      <ul>
        {list.map(each => (
          <Card key={each.id} details={each} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCardsView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureCase()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <h1>Travel Guide</h1>
        {this.renderResult()}
      </div>
    )
  }
}
export default App
