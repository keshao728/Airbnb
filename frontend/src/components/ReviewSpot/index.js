import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, Redirect, useParams } from "react-router-dom"
import { addReview} from "../../store/reviews"

const ReviewSpot = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { spotId } = useParams()
  const sessionUser = useSelector(state => state.session.user)
  // const spot = useSelector(state => state.spots.singleSpot)


  const [review, setReview] = useState('')
  const [stars, setStars] = useState(0)
  // const [selectStar, setSelectStar] = useState(4)

  const [validationErrors, setValidationErrors] = useState([])
  const [showErrors, setShowErrors] = useState(false)


  useEffect(() => {
    const errors = []
    if (!review || review.length < 5) errors.push('Please enter more than 5 characters')
    setValidationErrors(errors)
  }, [review])


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true)

    if (!validationErrors.length) {
      const newReview = {
        review,
        stars
      }

      let createdReview = await dispatch(addReview(spotId, newReview))
      if (createdReview) {
        setShowErrors(false)
        history.push(`/spots/${spotId}`);
      }
    }
  }

  if (!sessionUser) {
    return <Redirect to="/" />
  }

  const handleCancel = async (e) => {
    e.preventDefault()
    history.push(`/spots/${spotId}`);
  }

  return (
    <div className="full-host-form">
      <form className="host-form-parent" onSubmit={handleSubmit}>
        <h3 className="host-message">Add a Review Meow!!!</h3>
        {showErrors &&
          <ul className="form-errors">
            {validationErrors.length > 0 &&
              validationErrors.map(error => (
                <li key={error}>{error}</li>
              ))}
          </ul>
        }
        <div className="host-form">
          <label>
            <textarea
              placeholder="How was your experience?"
              type="text"
              className="review-input"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>

          <div className='create-review-input-rating'>
            <label>
              ★<input
                type='number'
                min='0' max='5'
                placeholder='stars'
                value={stars}
                onChange={e => setStars(e.target.value)}>
              </input>
            </label>
          </div>
        </div>
        <button className="button-create-spot" type="submit"> Add Review</button>
        <button type="button" className="button-create-spot" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}
export default ReviewSpot