import React, { useEffect, useState } from 'react'
import payload from 'payload'
import './index.scss'

const baseClass = 'after-dashboard'

interface Props {
  facebookAccountId?: string
  facebookAppId?: string
}

const AfterDashboard: React.FC<Props> = ({ facebookAccountId, facebookAppId }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mediaData, setMediaData] = useState([])

  function loadFacebookSDK(d: Document, s: string, id: string) {
    var js: HTMLScriptElement,
      fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement(s) as HTMLScriptElement
    js.id = id
    js.src = 'https://connect.facebook.net/en_US/sdk.js'
    if (fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs)
    }
  }

  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: facebookAccountId,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      })

      FB.AppEvents.logPageView()
    }

    loadFacebookSDK(document, 'script', 'facebook-jssdk')
  }, [])

  const handleLogin = () => {
    FB.login(
      function (response: any) {
        if (response.status === 'connected') {
          console.log('Logged in.')
          setIsLoggedIn(() => true)
        } else {
          console.log('Not logged in.')
          setIsLoggedIn(() => false)
        }
      },
      { scope: 'instagram_basic, email' },
    )
  }

  const getMedia = () => {
    FB.api(
      `/${facebookAccountId}/media`,
      'GET',
      {
        fields:
          'ig_id,media_url,permalink,thumbnail_url,comments_count,like_count,caption,id,username,timestamp,is_shared_to_feed,media_type,owner,shortcode,comments',
      },
      function (response: any) {
        if (response.data) {
          console.log(response.data)
          setMediaData(() => response.data)
        }
      },
    )
  }

  const handleAddToCollection = () => {
    mediaData.forEach(async (media: any) => {
      // await payload.create({
      //   collection: 'instagram-collection',
      //   data: {
      //     additionalData: media,
      //   },
      // })
      await fetch('/api/instagram-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(media),
      })
    })
  }

  return (
    <div className={baseClass}>
      <h4>Instagram Plugin</h4>
      <p>This plugin allows you to connect to Instagram and fetch media data from your account.</p>
      <p>
        To get started, click the "Login" button below. You will be prompted to log in to Instagram
        and authorize the plugin to access your account.
      </p>
      <p>
        Once you have logged in, click the "Get insta data" button to fetch media data from your
        account. This will return a list of media objects with various properties.
      </p>
      <p>
        You can use this data to display your Instagram media on your website, or to create custom
        galleries and displays.
      </p>

      <div className="button-wrapper">
        {!isLoggedIn ? <button onClick={handleLogin}>Login</button> : null}

        {isLoggedIn ? <button onClick={getMedia}>Get insta data</button> : null}

        {mediaData.length > 0 ? (
          <button onClick={handleAddToCollection}>Add to collection</button>
        ) : null}
      </div>

      <div className="media-data">
        {mediaData.map((media: any) => {
          return (
            <a href={media.permalink} key={media.id} className="media-item">
              <img
                src={media?.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url}
                alt={media.caption}
              />
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default AfterDashboard
