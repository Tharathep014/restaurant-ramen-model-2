import { Link, useParams } from 'react-router-dom'

const pages = {
  about: { title: 'About Nami', body: 'Nami Ramen serves carefully prepared Japanese comfort food with rich broth, handmade sides, and a warm neighborhood welcome.' },
  faq: { title: 'Frequently Asked Questions', body: 'For order changes, pickup timing, delivery questions, or payment support, please contact the restaurant directly.' },
  terms: { title: 'Terms of Use', body: 'Orders are prepared after confirmation. Menu availability, preparation times, and prices may change without notice.' },
  privacy: { title: 'Privacy Policy', body: 'We use your account information to authenticate you and show your order history. We do not sell personal information.' },
}

export default function InfoPage() {
  const { page } = useParams()
  const content = pages[page] || pages.about

  return (
    <div className="column info-page">
      <Link to="/profile" className="info-page__back">‹ Back to profile</Link>
      <h1>{content.title}</h1>
      <p>{content.body}</p>
    </div>
  )
}
