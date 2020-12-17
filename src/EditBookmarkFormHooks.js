import React, {useState, useEffect} from 'react'
import {useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import config from './config'

export default function EditBookmarkForm(){
 // const context = useContext(BookmarksContext);
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(0)
  const [error, setError] = useState({})
  const { bookmarkId } = useParams()
  const {push} = useHistory();

 function handleClickCancel(){
    push('/')
 }
        


  function handleSubmit(e){
    e.preventDefault()
    const newBookmark = {
      id: parseInt(bookmarkId),
      title,
      url,
      description,
      rating
    }

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
           // context.updateBookmark(newBookmark)
            push('/');
          })
        .catch(error => setError({ error }))
    }

  useEffect(()=>{

        fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
                }
        })
            .then(response => response.json())
            .then(responseJson => {
                    setTitle(responseJson.title)
                    setUrl(responseJson.url)
                    setDescription(responseJson.description)
                    setRating(responseJson.rating)
            })
            .catch(error => setError(true))
  },[])

  return (
    <section className='EditBookmarkForm'>
        <h2>Edit Bookmark</h2>
        <form
            className='EditBookmark__form'
            onSubmit={handleSubmit}
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
                    onChange={e => setTitle(e.target.value)}
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
                    onChange={e => setTitle(e.target.value)}
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
                onChange={e => setDescription(e.target.value)}
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
                    onChange={e => setRating(e.target.value)}
                />
            </div>
            <div className='EditBookmark__buttons'>
                <button type='button' onClick={handleClickCancel}>
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