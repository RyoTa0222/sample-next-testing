import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import { getAllPostsData } from '../lib/fetch'
import { POST } from '../types/Types'
import Post from '../components/Post'

interface STATICPROPS {
  posts: POST[]
}

const ContextPage: React.FC<STATICPROPS> = ({ posts }) => {
  return (
    <Layout title="Blog">
      <p className="text-4xl">blog page</p>
      <ul>{posts && posts.map((post) => <Post key={post.id} {...post} />)}</ul>
    </Layout>
  )
}
export default ContextPage

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPostsData()
  return {
    props: { posts },
  }
}
