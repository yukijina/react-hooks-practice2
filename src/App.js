import React, {useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function App() {

  const[results, setResults] = useState([])
  const [query, setQuery] = useState('react hooks');
  // we don't need argument for useRef. useRef returns object
  const searchInputRef = useRef();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)



  // 1."getResults()" useEffect runs every render. Request only once, otherwise, it goes to infiniteloop. To avoid that, we need empty [] at the end.
  // 2."getQuery()"  adding query in the array. When query changed (setQuery), it runs/renders again.
  // So in the array, you should put variable, that needs to be changed when the value changed.
  //useEffect(() => {
    //getResults()
    //queryResults()
  //},[query])  // onChange (serach when input value changed) add [query] 

  useEffect(() => {
    queryResults()
  },[]) // onClick(when you add onClck on button) - remove variable (one time) 

  const getResults = async() => {
    const response = await axios.get('http://hn.algolia.com/api/v1/search?query=reacthooks')
    setResults(response.data.hits)
  }

  //dynamicaly input query
  const queryResults = async() => {
    setLoading(true)
    try {
      const response = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`)
      setResults(response.data.hits)
    } catch(error) {
      setError(error)
    }
    setLoading(false)
  }


  const handleSubmit = event => {
    event.preventDefault();
    queryResults()
  }

  const handleClearSearch = () => {
    setQuery("")
    //cursor is moved to input column after users clicked the "Clear" button
    searchInputRef.current.focus()
  }

  return (
    <div className="container max-w-md mx-auto p-4 m-2 bg-green-200 shoadow-lg rounded">
      <img src="http://icon.now.sh/react/c0c" alt="react logo" className="float-right h-12" /> 
      <h1 className="text-gray-600 font-thin">Hooks News</h1>
    <form onSubmit={handleSubmit} className="mb-2">
      <input 
        type="text" 
        onChange={e => setQuery(e.target.value)} 
        value={query}
        ref={searchInputRef}
        className="border p-1 rounded"
      />
      {/* when you add functionality on the button, users have to navigate to this btn.
      if you want to make submit "enter" works, you have to add onSubmit to the form */}
      {/* <button type="button" onClick={queryResults}>Search</button> */}
      <button type="submit" className="bg-orange-400 rounded m-1 p-1">Search</button>
      {/* we do not want to be controlled by form onSubmit so we set type="button" not "submit"  */}
      <button type="button" onClick={handleClearSearch} className="bg-blue-400 rounded m-1 p-1 text-white">Clear</button>
    </form>
    { loading ? (
    <div>Loading...</div>
    ) : (
    <ul>
     {results.map(result => (
       <li key={result.objectID}>
         <a href={result.url} className="text-indigo-800 hover:text-indigo-400">{result.title}</a>
       </li>
     ))}
    </ul>
    )}

      {error && <div className="text-red font-bold">{error.message}</div>}
    </div>
  );
}


