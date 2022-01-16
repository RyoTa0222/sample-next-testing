/**
 * @jest-environment jsdom
 */

import { render, screen, cleanup } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
import TaskPage from '../pages/task-page'
import { TASK } from '../types/Types'

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/todos/', (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'Task A',
            completed: false,
          },
          {
            userId: 2,
            id: 2,
            title: 'Task B',
            completed: true,
          },
        ])
      )
    }
  })
)

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

describe('Todo page / useSWR', () => {
  const staticProps: TASK[] = [
    {
      userId: 3,
      id: 3,
      title: 'Static task C',
      completed: false,
    },
    {
      userId: 4,
      id: 4,
      title: 'Static task D',
      completed: false,
    },
  ]
  it('Should render CSF data after pre-rendered data', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskPage staticTasks={staticProps} />
      </SWRConfig>
    )
    // propsの値が描画
    expect(await screen.findByText('Static task C')).toBeInTheDocument()
    expect(screen.getByText('Static task D')).toBeInTheDocument()
    // screen.debug()
    // サーバーサイドから取得されたデータが描画
    expect(await screen.findByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
    // screen.debug()
  })
  it('Should render Error text when fetch failed', async () => {
    server.use(
      rest.get(
        'https://jsonplaceholder.typicode.com/todos/',
        (req, res, ctx) => {
          const query = req.url.searchParams
          const _limit = query.get('_limit')
          if (_limit === '10') {
            return res(ctx.status(400))
          }
        }
      )
    )
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskPage staticTasks={staticProps} />
      </SWRConfig>
    )
    expect(await screen.findByText('Error!')).toBeInTheDocument()
    // screen.debug()
  })
})
