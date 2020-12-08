import React, {Component} from 'react'
import BookmarksContext from './BookmarksContext';

import config from './config'

export default class EditBookmarkForm extends Component {
    static contextType = BookmarksContext;

    state = {
        id: this.props.match.params.bookmarkId,
        title: this.props.title,
        url: this.props.url,
        description: this.props.description,
        rating: this.props.rating,
        error: null
    };

    handleChangeTitle(title) {
        this.setState({
            title
        })
    }

    handleChangeUrl(url) {
        this.setState({
            url
        })
    }

    handleChangeDescription(description) {
        this.setState({
            description
        })
    }

    handleChangeRating(rating) {
        this.setState({
            rating
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    }

    handleSubmit = (e) => {
        e.preventDefault()

        //insert validation here//

        const bookmarkId = this.props.match.params.bookmarkId
        const { title, url, description, rating } = this.state
        const newBookmark = {id: parseInt(bookmarkId), title, url, description, rating}

        fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(newBookmark),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
                }
        })
        .then(res => {
            if (!res.ok) {
              // get the error message from the response,
              return res.json().then(error => Promise.reject(error))
            }
          })
          .then(responseData => {
            this.context.updateBookmark(newBookmark)
            this.props.history.push('/')
          })
        .catch(error => this.setState({ error }))
    }

    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId
        fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
                }
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    title: responseJson.title,
                    url: responseJson.url,
                    description: responseJson.description,
                    rating: responseJson.rating
                })
            })
            .catch(error => this.setState({ error }))
    }

    render() {
        const { title, url, description, rating } = this.state;
        return (
            <section className='EditBookmarkForm'>
                <h2>Edit Bookmark</h2>
                <form
                    className='EditBookmark__form'
                    onSubmit={e => this.handleSubmit(e)}
                >
                    <div className='EditBookmark__error' role='alert'>
                        {/* {error && <p>{error.message}</p>} */}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
                            {' '}
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            value= {title}
                            onChange={e => this.handleChangeTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
                            {' '}
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            value = {url}
                            onChange={e => this.handleChangeUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
                        </label>
                        <textarea
                        name='description'
                        id='description'
                        value={description}
                        onChange={e => this.handleChangeDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
                            {' '}
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            defaultValue='5'
                            min='1'
                            max='5'
                            value={rating}
                            onChange={e => this.handleChangeRating(e.target.value)}
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                            Save
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}