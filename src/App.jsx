import { Form } from './components/Form'
import { Background } from './components/Background'
import './styles/App.css'

export function App() {
  return (
    <>
      <Background />
      <header></header>

      <main>
        <section>
          <div>
            <h2 className='title'>Philosophy Tea</h2>
            <p>
              Write your question to know what your favorite Philosopher would
              say, according to their school of Philosophy.
            </p>
            <p>Grab a cup of tea and let's philosophize.</p>

            <Form />
          </div>
        </section>
      </main>
    </>
  )
}
