import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import '../styles/Form.css'
import { PhilosopherInfo } from './PhilosopherInfo'
import '../styles/PhilosopherInfo.css'

export function Form() {
  const [apiKey, setApiKey] = useState('')
  const [philosopher, setPhilosopher] = useState('')
  const [question, setQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPhilosopherInfo, setShowPhilosopherInfo] = useState(false)
  const [selectedPhilosopherForInfo, setSelectedPhilosopherForInfo] =
    useState(null)

  const aiResponseRef = useRef(null)

  useEffect(() => {
    if (aiResponse && aiResponseRef.current) {
      aiResponseRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [aiResponse])

  const askGemini = async (
    currentQuestion,
    selectedPhilosopher,
    currentApiKey
  ) => {
    const model = 'gemini-2.5-flash'
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentApiKey}`

    const prompt = `
    ## Specialty
      You are an expert meta assistant for the philosopher ${selectedPhilosopher}.

      ## Task
      You must answer the user's questions based on your knowledge of the philosopher's school of thought, strategies, and tips.

      ## Rules
      - If you don't know the answer, respond with 'I don't know' and don't try to invent an answer.
      - If the question is not related to philosophy, respond with 'This question is not related to philosophy.'
      - Consider the current date ${new Date().toLocaleDateString('en-US')}
      - Conduct updated research on the current context, based on the current date, to provide a coherent answer.
      - Never respond with items you are not sure exist in the current context.

      ## Response
      - Be concise in your answer, be direct, and respond in a maximum of 800 characters.
      - You can be funny and make some jokes inside the context, but never saying things you are not sure exist in the current context.
      - Respond in markdown.
      - No need for greetings or farewells, just answer what the user is asking.

      ## Example Response
      User question: What is the meaning of life according to Albert Camus?
      Answer: According to Albert Camus, the meaning of life is not inherent but found in the embrace of the absurd, recognizing the conflict between humanity's desire for meaning and the universe's indifference.

      ---
      Here is the user's question: ${currentQuestion}    
    `

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]

    const tools = [{ google_search: {} }]

    try {
      const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          tools
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error.message || 'Failed to fetch response from Gemini API.'
        )
      }

      const data = await response.json()
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        return data.candidates[0].content.parts[0].text
      } else {
        throw new Error('Unexpected response format from Gemini API')
      }
    } catch (err) {
      console.error('Error calling Gemini API:', err)
      throw err
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!apiKey || !philosopher || !question) {
      setError('Please fill in all fields.')
      setAiResponse(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setAiResponse(null)

    try {
      const text = await askGemini(question, philosopher, apiKey)
      setAiResponse(text)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  console.log('API Key: ', apiKey)
  console.log('Philosopher: ', philosopher)
  console.log('Question: ', question)

  const handleShowPhilosopherInfo = () => {
    if (philosopher) {
      setSelectedPhilosopherForInfo(philosopher)
      setShowPhilosopherInfo(true)
    } else {
      setError('Please select a philosopher first.')
    }
  }

  const handleClosePhilosopherInfo = () => {
    setShowPhilosopherInfo(false)
    setSelectedPhilosopherForInfo(null)
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        id='apiKey'
        type='password'
        placeholder="Please inform your Gemini's API KEY"
        required
        value={apiKey}
        onChange={event => setApiKey(event.target.value)}
      />
      <div
        style={{
          display: 'flex',
          gap: '0.85rem',
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <select
          id='philosopherSelect'
          value={philosopher}
          onChange={event => setPhilosopher(event.target.value)}
          style={{ flex: 1 }}
        >
          <option value=''>Select a Philosopher</option>
          <option value='albert-camus'>Albert Camus</option>
          <option value='aristotle'>Aristotle</option>
          <option value='epictetus'>Epictetus</option>
          <option value='friedrich-nietzsche'>Friedrich Nietzsche</option>
          <option value='immanuel-kant'>Immanuel Kant</option>
          <option value='jean-paul-sartre'>Jean-Paul Sartre</option>
          <option value='marcus-aurelius'>Marcus Aurelius</option>
          <option value='plato'>Plato</option>
          <option value='rene-descartes'>René Descartes</option>
          <option value='seneca'>Seneca</option>
          <option value='socrates'>Socrates</option>
          <option value='soren-kierkegaard'>Søren Kierkegaard</option>
          <option value='voltaire'>Voltaire</option>
        </select>
        {/*   */}

        <button
          type='button'
          onClick={handleShowPhilosopherInfo}
          disabled={!philosopher}
          style={{ width: 'auto', padding: '0.675rem 1rem', flex: 'none' }}
        >
          Who's that?
        </button>
      </div>
      <input
        id='questionInput'
        type='text'
        placeholder='What would this philosopher say about brain rot?'
        required
        value={question}
        onChange={event => setQuestion(event.target.value)}
      />
      <button id='askButton' type='submit' disabled={isLoading}>
        {isLoading ? 'Preparing Tea...' : 'Ask'}
      </button>
      {error && (
        <p
          className='error-message'
          style={{ color: 'orange', marginTop: '1rem' }}
        >
          {error}
        </p>
      )}
      {aiResponse && (
        <div id='aiResponse' ref={aiResponseRef}>
          <div
            className='response-content'
            dangerouslySetInnerHTML={{ __html: marked.parse(aiResponse) }}
          ></div>
        </div>
      )}
      <PhilosopherInfo
        philosopherId={selectedPhilosopherForInfo}
        onClose={handleClosePhilosopherInfo}
      />
    </form>
  )
}
