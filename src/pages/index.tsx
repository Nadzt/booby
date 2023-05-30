import { GetServerSideProps } from 'next'
import RepositorySearchForm, {
  SortOption,
  languageOprionts,
  sortOptions,
} from '../Components/repositorySearchForm'
import { GitHubRepository, getRepositories, GitHubRepositorySearch } from './api/githubApi'
import HeadComp from '@/Components/head'
import Header from '@/Components/header'
import RepositoryCard from '@/Components/repositoryCard'

type Props = {
  repositories: GitHubRepository[]
  language: string
  sort: string
  page: number
}

export default function Home({ repositories, language, sort, page }: Props) {
  return (
    <>
      <HeadComp />
      <Header />
      <main>
        <div className='flex justify-end mr-8'>
          <RepositorySearchForm language={language} sort={sort} />
        </div>
        <div className='p-4 justify-center'>
          {repositories.length > 0 ? (
            repositories.map((repository) => (
              <RepositoryCard key={repository.id} repository={repository} />
            ))
          ) : (
            <h1>NO Data or API Error. Please wait </h1>
          )}
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchCondition: GitHubRepositorySearch = {
    language: 'javascript',
    sort: 'stars',
    page: 1,
  }
  let language = 'javascript'
  let sort: SortOption['value'] = 'stars'
  let page = 1
  if (Object.keys(context.query).length > 0) {
    // language
    if (context.query.language !== '' && typeof context.query.language == 'string') {
      searchCondition.language = context.query.language
      language =
        languageOprionts.find((option) => option.value === context.query.language)?.value ??
        'javascript'
    }
    // sort
    if (context.query.sort !== '' && typeof context.query.sort == 'string') {
      sort = sortOptions.find((option) => option.value === context.query.sort)?.value ?? 'stars'
      searchCondition.sort = sort
    }
    // page
    if (context.query.page !== '' && typeof context.query.page == 'string') {
      page = Number(context.query.page)
      if (isNaN(page)) {
        page = 1
      }
      searchCondition.page = page
    }
  }
  const repositories = await getRepositories(searchCondition)
  return {
    props: {
      repositories,
      language,
      sort,
      page,
    },
  }
}
