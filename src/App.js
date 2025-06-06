import './App.css';
import {useEffect, useState, useMemo} from "react";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions()
  {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction()
  {
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = name.split(' ')[0];
    return fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        name:name.substring(price.length + 1),
        price,
        description,
        datetime
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        return json;
      });
    });
  }

  const {balance, fraction} = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + t.price, 0);
    const [intPart, fracPart] = total.toFixed(2).split('.');
    return {balance: intPart, fraction: fracPart};
  }, [transactions]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    addNewTransaction().then(() => getTransactions().then(setTransactions));
  };
  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={handleSubmit}>
        <div className="basic">
          <input type="text" 
                 value={name}
                 onChange={ev => setName(ev.target.value)}
                 placeholder={'+800 Paycheck'}/>
          <input value={datetime}
                 onChange={ev => setDatetime(ev.target.value)}
                 type="datetime-local"/>
        </div>
        <div className="description">
          <input type="text"
                 value={description}
                 onChange={ev => setDescription(ev.target.value)}
                 placeholder={'Description'}/>
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              {console.log(transaction.price)}
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className="datetime">06/03/2025, 21:06</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
