import { useState, useEffect } from 'react'

import { ChangePassword } from '../services/AuthReq'

import FeatCard from '../components/FeatCard'
import FeatForm from '../components/FeatForm'
import { GetUserFeats } from '../services/FeatReq'

const Profile = ({
  feats,
  user,
  active,
  featFormValues,
  formDisplay,
  updateFeatFormValues,
  displayCreateForm,
  submitFeatForm,
  emoji,
  reRender,
  setReRender,
  setActive,
  setFormDisplay,
  setFeatFormValues,
  featEditing,
  updateText,
  displayEditFeat,
  deleteUserFeat
}) => {
  const [userFeats, setUserFeats] = useState(null)
  const [passwordEditing, setPasswordEditing] = useState(false)
  const [passwordFormValues, setPasswordFormValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    username: user.username
  })
  const [success, setSuccess] = useState('') // consider use case for this
  const [infoDisplay, setInfoDisplay] = useState('flex')
  const [passwordFormDisplay, setPasswordFormDisplay] = useState('none')

  const renderPasswordEditing = () => {
    if (!passwordEditing) {
      setPasswordEditing(true)
      setInfoDisplay('none')
      setPasswordFormDisplay('flex')
    } else {
      setPasswordEditing(false)
      setInfoDisplay('flex')
      setPasswordFormDisplay('none')
    }
  }

  const updatePasswordValues = (e) => {
    setPasswordFormValues({
      ...passwordFormValues,
      [e.target.name]: e.target.value
    })
  }

  const submitNewPassword = async (e) => {
    e.preventDefault()
    const res = await ChangePassword(passwordFormValues)
    setSuccess(res.msg)
    setPasswordFormValues({
      ...passwordFormValues,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    setPasswordEditing(false)
    setInfoDisplay('flex')
    setPasswordFormDisplay('none')
  }

  const renderUserFeats = async (userId) => {
    const res = await GetUserFeats(userId)
    if (res.length > 0) {
      setUserFeats(res)
    } else {
      setUserFeats('Share a Feat!')
    }
  }

  useEffect(() => {
    renderUserFeats(user.id)
    setActive(false)
    setFormDisplay('none')
    setReRender(false)
  }, [reRender])

  return (
    <main>
      <section id="user-info-container">
        <div id="user-info" style={{ display: `${infoDisplay}` }}>
          <h2>{user.username}</h2>
          <h3>{user.email}</h3>
          <h3>{user.location}</h3>
        </div>
        <form
          id="user-info-form"
          style={{ display: `${passwordFormDisplay}` }}
          onSubmit={(e) => submitNewPassword(e)}
        >
          <input
            type="password"
            name="oldPassword"
            value={passwordFormValues.oldPassword}
            onInput={updatePasswordValues}
            required
          />
          <input
            type="password"
            name="newPassword"
            value={passwordFormValues.newPassword}
            onInput={updatePasswordValues}
            required
          />
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordFormValues.confirmNewPassword}
            onInput={updatePasswordValues}
            required
          />
          <button
            type="submit"
            disabled={
              !passwordFormValues.oldPassword ||
              !passwordFormValues.newPassword ||
              !passwordFormValues.confirmNewPassword ||
              passwordFormValues.newPassword !==
                passwordFormValues.confirmNewPassword
            }
          >
            Submit
          </button>
        </form>
        <button onClick={renderPasswordEditing}>Change Password</button>
      </section>
      <section id="user-feats">
        <button onClick={displayCreateForm} disabled={active}>
          Share Feat!
        </button>
        <div style={{ display: `${formDisplay}` }}>
          <FeatForm
            displayCreateForm={displayCreateForm}
            featFormValues={featFormValues}
            updateFeatFormValues={updateFeatFormValues}
            submitFeatForm={submitFeatForm}
            emoji={emoji}
          />
        </div>
        <div>
          {userFeats?.reverse().map((feat) => (
            <div key={feat.id}>
              {!featEditing ? (
                <FeatCard feat={feat} />
              ) : (
                <FeatForm
                  feat={feat}
                  featFormValues={featFormValues}
                  featEditing={featEditing}
                  updateFeatFormValues={updateFeatFormValues}
                  submitFeatForm={submitFeatForm}
                  emoji={emoji}
                  setFeatFormValues={setFeatFormValues}
                />
              )}
              <button onClick={displayEditFeat}>{updateText}</button>
              <button onClick={() => deleteUserFeat(feat.id)}>X</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Profile
