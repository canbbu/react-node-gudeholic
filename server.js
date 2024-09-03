const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/customers', (req,res) =>{
    res.send(
        [
        {
          id: '1',
          img: 'https://source.unsplash.com/user/max_duz/300x300',
          name: 'young',
          age: '33',
          job: 'react engineer',
        },
        {
          id: '2',
          img: 'https://placeimg.com/64/64/any',
          name: 'jisu',
          age: '31',
          job: 'my girlfriend',
        },
        {
          id: '3',
          img: 'https://placeimg.com/64/64/any',
          name: 'goduck',
          age: '33',
          job: 'friend',
        },
      ]
    )
})

app.listen(port, () => console.log(`Listening on port ${port}`))

