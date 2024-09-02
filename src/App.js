import logo from './logo.svg';
import Customer from './components/Customer'
import './App.css';

const customers = [
    {
    'id' : '1',
    'img' : 'https://source.unsplash.com/user/max_duz/300x300',
    'name' : 'young',
    'age' : '33',
    'job'  : 'react engineer',
  },
  {
    'id' : '2',
    'img' : 'https://placeimg.com/64/64/any',
    'name' : 'jisu',
    'age' : '31',
    'job'  : 'my girlfriend',
  },
  {
    'id' : '3',
    'img' : 'https://placeimg.com/64/64/any',
    'name' : 'goduck',
    'age' : '33',
    'job'  : 'friend',
  },
]

function App() {
  return (
    customers.map(customer => {return (<Customer key = {customer.id} id = {customer.img} name = {customer.name} age = {customer.age} job = {customer.job}/>)})
  );
}

export default App;
