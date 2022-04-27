import { useEffect, useState, useReducer } from 'react';
import Gun from 'gun';

// initialize Gun
const gun = Gun({
  peers: [
    'http://localhost:4000/gun'
  ]
});

const initialState = {
  messages: []
}

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
};

export default function App() {
  const [formState, setFormState] = useState({
    name:'', message: ''
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messages = gun.get('messages');
    messages.map().once(m => {
      dispatch({
        name: m.name,
        message: m.message,
        // createdAt: m.createdAt
      });
    });
  }, []);
  
  function onChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  };

  function saveMessage() {
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: formState.message,
      // createdAt: Date.now()
    });
    setFormState({
      name:'', message: ''
    });
  };
  function clearMessage() {
    const messages = gun.get('messages');
    console.log(messages)
    messages.put(null)
  }


  return (
    <div>
      <input
        onChange={onChange}
        placeholder='Name'
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder='Message'
        name="message"
        value={formState.message}
      />
      <button onClick={saveMessage}>Send Message</button>
      <button onClick={clearMessage}>Clear Messages</button>
      {
        state.messages.map((message, key) => (
          <div key={key}>
            <h2>{message.message}</h2>
            <h3>Form: {message.name}</h3>
            {/* <p>Date: {message.createdAt}</p> */}
          </div>
        ))
      }
    </div>
  );

};